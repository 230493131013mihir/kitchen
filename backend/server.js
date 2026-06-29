const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const simpleRoutes = require("./src/routes/simpleRoutes");
const setupDatabase = require("./src/config/setup");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "KitchenIQ API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api", simpleRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong"
  });
});

setupDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`KitchenIQ backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database setup failed:", error.message);
    process.exit(1);
  });
