const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/categories", async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/categories", async (req, res, next) => {
  try {
    const { name, image_url = null } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const [result] = await pool.query("INSERT INTO categories (name, image_url) VALUES (?, ?)", [name, image_url]);
    res.status(201).json({ id: result.insertId, name, image_url });
  } catch (error) {
    next(error);
  }
});

router.get("/items", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT mi.*, c.name AS category_name, c.image_url AS category_image_url
      FROM menu_items mi
      LEFT JOIN categories c ON c.id = mi.category_id
      ORDER BY mi.id DESC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/items", async (req, res, next) => {
  try {
    const { name, category_id, price, cost_price = 0, image_url = null, is_available = true } = req.body;
    if (!name || !price) return res.status(400).json({ message: "Name and price are required" });

    const [result] = await pool.query(
      "INSERT INTO menu_items (name, category_id, price, cost_price, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)",
      [name, category_id || null, price, cost_price, image_url, is_available]
    );

    res.status(201).json({ id: result.insertId, name, category_id, price, cost_price, image_url, is_available });
  } catch (error) {
    next(error);
  }
});

router.put("/items/:id", async (req, res, next) => {
  try {
    const { name, category_id, price, cost_price = 0, image_url = null, is_available = true } = req.body;
    await pool.query(
      "UPDATE menu_items SET name = ?, category_id = ?, price = ?, cost_price = ?, image_url = ?, is_available = ? WHERE id = ?",
      [name, category_id || null, price, cost_price, image_url, is_available, req.params.id]
    );
    res.json({ message: "Menu item updated" });
  } catch (error) {
    next(error);
  }
});

router.delete("/items/:id", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM menu_items WHERE id = ?", [req.params.id]);
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
