import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { endpoints } from "../services/api";
import { Loading } from "../components/States";

export default function Success() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  const receiptRef = useRef(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await endpoints.order(id);

        setOrder(response.data.order);
      } catch (err) {
        console.error("Unable to load order:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load order details"
        );
      }
    }

    loadOrder();
  }, [id]);

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <h2>Unable to load order</h2>

            <p>{error}</p>

            <Link className="btn" to="/orders">
              Go to My Orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!order) {
    return <Loading />;
  }

  /*
   * Generate PDF receipt
   */
  async function downloadReceipt() {
    if (!receiptRef.current) {
      return;
    }

    try {
      setGenerating(true);

      const canvas = await html2canvas(
        receiptRef.current,
        {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        }
      );

      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;

      const availableWidth = pageWidth - margin * 2;

      const imageHeight =
        (canvas.height * availableWidth) /
        canvas.width;

      let heightLeft = imageHeight;
      let position = margin;

      pdf.addImage(
        imageData,
        "PNG",
        margin,
        position,
        availableWidth,
        imageHeight
      );

      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position =
          heightLeft - imageHeight + margin;

        pdf.addPage();

        pdf.addImage(
          imageData,
          "PNG",
          margin,
          position,
          availableWidth,
          imageHeight
        );

        heightLeft -= pageHeight - margin * 2;
      }

      pdf.save(`NovaShop-Order-${order.id}.pdf`);
    } catch (err) {
      console.error("Receipt generation error:", err);

      alert(
        "Unable to generate receipt. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  }

  /*
   * Print receipt
   */
  function printReceipt() {
  const receipt = receiptRef.current;

  if (!receipt) {
    return;
  }

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=1000"
  );

  if (!printWindow) {
    alert("Please allow pop-ups to print the receipt.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>NovaShop Receipt - Order #${order.id}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 30px;
            background: white;
            color: #222;
            font-family: Arial, sans-serif;
          }

          .receipt {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }

          h1,
          h2,
          h3,
          p {
            margin-top: 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }

          th {
            text-align: left;
          }

          @media print {
            body {
              padding: 0;
            }

            .receipt {
              max-width: none;
              border: none !important;
              box-shadow: none !important;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          ${receipt.innerHTML}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

  return (
    <section className="section success-page">
      <div className="container">

        {/* SUCCESS MESSAGE */}

        <div className="success-header">
          <div className="success-icon">
            ✓
          </div>

          <h1>
            Order Placed Successfully!
          </h1>

          <p>
            Thank you for shopping with NovaShop.
          </p>

          <p>
            Your order{" "}
            <strong>#{order.id}</strong>{" "}
            has been successfully placed.
          </p>
        </div>


        {/* RECEIPT */}

        <div
          ref={receiptRef}
          className="receipt"
          style={{
            background: "#ffffff",
            color: "#222222",
            padding: "30px",
            maxWidth: "800px",
            margin: "30px auto",
            border: "1px solid #dddddd",
            borderRadius: "8px",
          }}
        >

          {/* HEADER */}

          <div
            style={{
              textAlign: "center",
              borderBottom: "2px solid #222",
              paddingBottom: "20px",
              marginBottom: "25px",
            }}
          >
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "32px",
              }}
            >
              NovaShop
            </h1>

            <p
              style={{
                margin: "5px 0",
                fontSize: "18px",
              }}
            >
              Order Receipt
            </p>

            <p>
              <strong>
                Order #{order.id}
              </strong>
            </p>
          </div>


          {/* ORDER INFORMATION */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "20px",
              marginBottom: "25px",
            }}
          >

            {/* SHIPPING */}

            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "6px",
              }}
            >
              <h3>
                Shipping Details
              </h3>

              <p>
                <strong>
                  {order.shipping_name}
                </strong>
              </p>

              <p>
                {order.shipping_phone}
              </p>

              <p>
                {order.shipping_address}
              </p>

              <p>
                {order.city},{" "}
                {order.state}
              </p>

              <p>
                PIN: {order.pincode}
              </p>
            </div>


            {/* ORDER DETAILS */}

            <div
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "6px",
              }}
            >
              <h3>
                Order Details
              </h3>

              <p>
                <strong>
                  Order ID:
                </strong>{" "}
                #{order.id}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {order.order_status}
              </p>

              <p>
                <strong>
                  Payment:
                </strong>{" "}
                {String(
                  order.payment_method || ""
                ).toUpperCase()}
              </p>

              <p>
                <strong>
                  Payment Status:
                </strong>{" "}
                {order.payment_status}
              </p>

              {order.created_at && (
                <p>
                  <strong>
                    Date:
                  </strong>{" "}
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>
              )}
            </div>

          </div>


          {/* PRODUCTS */}

          <h3>
            Order Items
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom:
                      "1px solid #ddd",
                    padding: "10px",
                    textAlign: "left",
                  }}
                >
                  Product
                </th>

                <th
                  style={{
                    borderBottom:
                      "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  Quantity
                </th>

                <th
                  style={{
                    borderBottom:
                      "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  Price
                </th>

                <th
                  style={{
                    borderBottom:
                      "1px solid #ddd",
                    padding: "10px",
                    textAlign: "right",
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {(order.items || []).map(
                (item) => (
                  <tr key={item.id}>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      {item.product_name}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom:
                          "1px solid #eee",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      ₹
                      {Number(
                        item.price || 0
                      ).toFixed(2)}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom:
                          "1px solid #eee",
                        textAlign: "right",
                      }}
                    >
                      ₹
                      {Number(
                        item.subtotal || 0
                      ).toFixed(2)}
                    </td>

                  </tr>
                )
              )}
            </tbody>
          </table>


          {/* TOTAL */}

          <div
            style={{
              marginTop: "25px",
              borderTop:
                "2px solid #222",
              paddingTop: "15px",
              textAlign: "right",
            }}
          >
            <h2>
              Total Amount: ₹
              {Number(
                order.total_amount || 0
              ).toFixed(2)}
            </h2>
          </div>


          {/* FOOTER */}

          <div
            style={{
              textAlign: "center",
              marginTop: "35px",
              paddingTop: "20px",
              borderTop:
                "1px solid #ddd",
            }}
          >
            <p>
              Thank you for shopping
              with NovaShop!
            </p>

            <p>
              Please keep this receipt
              for your records.
            </p>
          </div>

        </div>


        {/* BUTTONS */}

        <div
          className="receipt-actions"
          style={{
            display: "flex",
            justifyContent:
              "center",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >

          <button
            className="btn"
            onClick={downloadReceipt}
            disabled={generating}
          >
            {generating
              ? "Generating PDF..."
              : "📄 Download Receipt"}
          </button>

          <button
            className="btn secondary"
            onClick={printReceipt}
          >
            🖨️ Print Receipt
          </button>

          <Link
            className="btn secondary"
            to="/orders"
          >
            View My Orders
          </Link>

          <Link
            className="btn secondary"
            to="/"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </section>
  );
}