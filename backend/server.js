import "dotenv/config";
import express from "express";

import health from "./api/health.js";

import authRegister from "./api/auth/register.js";
import authLogin from "./api/auth/login.js";
import authMe from "./api/auth/me.js";

import products from "./api/products/index.js";
import productById from "./api/products/[id].js";

import categories from "./api/categories/index.js";
import categoryById from "./api/categories/[id].js";

import cart from "./api/cart/index.js";
import cartById from "./api/cart/[id].js";

import orders from "./api/orders/index.js";
import orderById from "./api/orders/[id].js";

import banners from "./api/banners/index.js";
import bannerById from "./api/banners/[id].js";

import testimonials from "./api/testimonials/index.js";
import bookings from "./api/bookings/index.js";

import upload from "./api/upload/index.js";

const app = express();

const PORT = process.env.PORT || 3001;

/*
  JSON body parser.
  Multipart/form-data used by Cloudinary upload
  will pass through this middleware.
*/
app.use(express.json());

/*
  Basic request logging
*/
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/*
  Health
*/
app.all("/api/health", health);

/*
  Authentication
*/
app.all("/api/auth/register", authRegister);
app.all("/api/auth/login", authLogin);
app.all("/api/auth/me", authMe);

/*
  Products
*/
app.all("/api/products", products);

app.all("/api/products/:id", (req, res) => {
  req.query.id = req.params.id;
  return productById(req, res);
});

/*
  Categories
*/
app.all("/api/categories", categories);

app.all("/api/categories/:id", (req, res) => {
  req.query.id = req.params.id;
  return categoryById(req, res);
});

/*
  Cart
*/
app.all("/api/cart", cart);

app.all("/api/cart/:id", (req, res) => {
  req.query.id = req.params.id;
  return cartById(req, res);
});

/*
  Orders
*/
app.all("/api/orders", orders);

app.all("/api/orders/:id", (req, res) => {
  req.query.id = req.params.id;
  return orderById(req, res);
});

/*
  Banners
*/
app.all("/api/banners", banners);

app.all("/api/banners/:id", (req, res) => {
  req.query.id = req.params.id;
  return bannerById(req, res);
});

/*
  Testimonials
*/
app.all("/api/testimonials", testimonials);

/*
  Bookings
*/
app.all("/api/bookings", bookings);

/*
  Cloudinary upload
*/
app.all("/api/upload", upload);

/*
  404 handler
*/
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.path,
  });
});

/*
  Global error handler
*/
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

export { app };

export default app;