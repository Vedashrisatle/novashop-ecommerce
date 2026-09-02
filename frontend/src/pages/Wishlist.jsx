import { Link } from "react-router-dom";

export default function Wishlist() {
  return (
    <section className="page">
      <div className="container">
        <h1>Wishlist</h1>

        <div className="empty">
          <h2>Your wishlist is empty</h2>

          <p>
            Wishlist functionality will be available when the
            wishlist API endpoints are added.
          </p>

          <Link to="/categories" className="btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}