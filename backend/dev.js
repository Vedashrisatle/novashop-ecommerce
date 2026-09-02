import app from "./server.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("");
  console.log("=================================");
  console.log(" E-Commerce Backend Started");
  console.log("=================================");
  console.log(` Server: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log("=================================");
  console.log("");
});