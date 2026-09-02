import "dotenv/config";
import express from "express";

// ===============================
// Route Handlers
// ===============================

// Health
import health from "./routes/health.js";

// Authentication
import authRegister from "./routes/auth/register.js";
import authLogin from "./routes/auth/login.js";
import authMe from "./routes/auth/me.js";

// Products
import products from "./routes/products/index.js";
import productById from "./routes/products/[id].js";

// Categories
import categories from "./routes/categories/index.js";
import categoryById from "./routes/categories/[id].js";

// Cart
import cart from "./routes/cart/index.js";
import cartById from "./routes/cart/[id].js";

// Orders
import orders from "./routes/orders/index.js";
import orderById from "./routes/orders/[id].js";

// Banners
import banners from "./routes/banners/index.js";
import bannerById from "./routes/banners/[id].js";

// Other
import testimonials from "./routes/testimonials/index.js";
import bookings from "./routes/bookings/index.js";

// Cloudinary upload
import upload from "./routes/upload/index.js";


const app = express();


// ===============================
// Middleware
// ===============================

// Parse JSON request bodies
app.use(express.json());

// Basic request logging
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// ===============================
// Health
// ===============================

app.all("/api/health", health);


// ===============================
// Authentication
// ===============================

app.all("/api/auth/register", authRegister);
app.all("/api/auth/login", authLogin);
app.all("/api/auth/me", authMe);


// ===============================
// Products
// ===============================

app.all("/api/products", products);

app.all("/api/products/:id", (req, res) => {
  req.query.id = req.params.id;
  return productById(req, res);
});


// ===============================
// Categories
// ===============================

app.all("/api/categories", categories);

app.all("/api/categories/:id", (req, res) => {
  req.query.id = req.params.id;
  return categoryById(req, res);
});


// ===============================
// Cart
// ===============================

app.all("/api/cart", cart);

app.all("/api/cart/:id", (req, res) => {
  req.query.id = req.params.id;
  return cartById(req, res);
});


// ===============================
// Orders
// ===============================

app.all("/api/orders", orders);

app.all("/api/orders/:id", (req, res) => {
  req.query.id = req.params.id;
  return orderById(req, res);
});


// ===============================
// Banners
// ===============================

app.all("/api/banners", banners);

app.all("/api/banners/:id", (req, res) => {
  req.query.id = req.params.id;
  return bannerById(req, res);
});


// ===============================
// Testimonials
// ===============================

app.all("/api/testimonials", testimonials);


// ===============================
// Bookings
// ===============================

app.all("/api/bookings", bookings);


// ===============================
// Cloudinary Upload
// ===============================

app.all("/api/upload", upload);


// ===============================
// API 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.path,
  });
});


// ===============================
// Global Error Handler
// ===============================

app.use((err, _req, res, _next) => {
  console.error("Server error:", err);

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});


// ===============================
// Export for Vercel
// ===============================

export default app;
export { app };