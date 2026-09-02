import { query } from "../../lib/db.js";
import { auth, admin } from "../../lib/auth.js";
import { corsMw, ok } from "../../lib/http.js";

export default async (req, res) => {
  corsMw(req, res, async () => {
    if (!ok(req, res, ["GET", "PUT", "DELETE"])) {
      return;
    }

    // Works with both Vercel and local Express
    const id = req.query?.id || req.params?.id;

    if (!id) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // GET SINGLE PRODUCT
    if (req.method === "GET") {
      try {
        const result = await query(
          `SELECT
             p.*,
             c.name AS category_name,
             c.slug AS category_slug
           FROM products p
           JOIN categories c ON c.id = p.category_id
           WHERE p.id = $1`,
          [id]
        );

        if (!result.rowCount) {
          return res.status(404).json({
            message: "Product not found",
          });
        }

        const product = result.rows[0];

        // Related products
        const related = await query(
          `SELECT *
           FROM products
           WHERE category_id = $1
             AND id <> $2
           ORDER BY rating DESC
           LIMIT 4`,
          [product.category_id, id]
        );

        // Product images
        const images = await query(
          `SELECT *
           FROM product_images
           WHERE product_id = $1
           ORDER BY id`,
          [id]
        );

        return res.json({
          product: {
            ...product,
            images: images.rows,
          },
          related: related.rows,
        });
      } catch (error) {
        console.error("Get product error:", error);

        return res.status(500).json({
          message: "Unable to fetch product",
        });
      }
    }

    // PUT / DELETE require admin
    auth(req, res, () =>
      admin(req, res, async () => {
        try {
          // DELETE PRODUCT
          if (req.method === "DELETE") {
            const result = await query(
              "DELETE FROM products WHERE id = $1 RETURNING id",
              [id]
            );

            if (!result.rowCount) {
              return res.status(404).json({
                message: "Product not found",
              });
            }

            return res.json({
              message: "Deleted",
            });
          }

          // UPDATE PRODUCT
          const body = req.body || {};

          const result = await query(
            `UPDATE products
             SET
               name = COALESCE($1, name),
               description = COALESCE($2, description),
               price = COALESCE($3, price),
               original_price = COALESCE($4, original_price),
               discount = COALESCE($5, discount),
               category_id = COALESCE($6, category_id),
               brand = COALESCE($7, brand),
               stock = COALESCE($8, stock),
               rating = COALESCE($9, rating),
               image_url = COALESCE($10, image_url),
               cloudinary_public_id = COALESCE($11, cloudinary_public_id),
               updated_at = NOW()
             WHERE id = $12
             RETURNING *`,
            [
              body.name,
              body.description,
              body.price,
              body.original_price,
              body.discount,
              body.category_id,
              body.brand,
              body.stock,
              body.rating,
              body.image_url,
              body.cloudinary_public_id,
              id,
            ]
          );

          if (!result.rowCount) {
            return res.status(404).json({
              message: "Product not found",
            });
          }

          return res.json({
            product: result.rows[0],
          });
        } catch (error) {
          console.error("Product update/delete error:", error);

          return res.status(500).json({
            message: "Unable to update product",
          });
        }
      })
    );
  });
};