import { query } from "../../lib/db.js";
import { auth, admin } from "../../lib/auth.js";
import { corsMw, ok } from "../../lib/http.js";

export default async function handler(req, res) {
  corsMw(req, res, async () => {
    if (!ok(req, res, ["GET", "PUT"])) {
      return;
    }

    auth(req, res, async () => {
      try {
        const id = req.query?.id || req.params?.id;

        if (!id) {
          return res.status(400).json({
            message: "Order ID is required",
          });
        }

        /*
         * GET SINGLE ORDER
         */
        if (req.method === "GET") {
          let orderResult;

          /*
           * Admins can view any order.
           * Normal users can only view their own orders.
           */
          if (req.user.role === "admin") {
            orderResult = await query(
              `SELECT *
               FROM orders
               WHERE id = $1`,
              [id]
            );
          } else {
            orderResult = await query(
              `SELECT *
               FROM orders
               WHERE id = $1
               AND user_id = $2`,
              [id, req.user.id]
            );
          }

          if (!orderResult.rowCount) {
            return res.status(404).json({
              message: "Order not found",
            });
          }

          /*
           * Get order items
           */
          const itemResult = await query(
            `SELECT
               id,
               order_id,
               product_id,
               product_name,
               price,
               quantity,
               subtotal
             FROM order_items
             WHERE order_id = $1
             ORDER BY id`,
            [id]
          );

          return res.json({
            order: {
              ...orderResult.rows[0],
              items: itemResult.rows,
            },
          });
        }

        /*
         * PUT - ADMIN ONLY
         */
        admin(req, res, async () => {
          const allowedStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ];

          const status = req.body?.status;

          if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
              message: "Invalid status",
            });
          }

          const result = await query(
            `UPDATE orders
             SET order_status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
          );

          if (!result.rowCount) {
            return res.status(404).json({
              message: "Order not found",
            });
          }

          return res.json({
            order: result.rows[0],
          });
        });
      } catch (error) {
        console.error("Order API error:", error);

        return res.status(500).json({
          message:
            error.message ||
            "Unable to process order request",
        });
      }
    });
  });
}