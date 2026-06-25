const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM inventory ORDER BY name");
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, unit, quantity = 0, unit_cost = 0, reorder_level = 0 } = req.body;
    if (!name || !unit) return res.status(400).json({ message: "Name and unit are required" });

    const [result] = await pool.query(
      "INSERT INTO inventory (name, unit, quantity, unit_cost, reorder_level) VALUES (?, ?, ?, ?, ?)",
      [name, unit, quantity, unit_cost, reorder_level]
    );

    res.status(201).json({ id: result.insertId, name, unit, quantity, unit_cost, reorder_level });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name, unit, quantity = 0, unit_cost = 0, reorder_level = 0 } = req.body;
    await pool.query(
      "UPDATE inventory SET name = ?, unit = ?, quantity = ?, unit_cost = ?, reorder_level = ? WHERE id = ?",
      [name, unit, quantity, unit_cost, reorder_level, req.params.id]
    );
    res.json({ message: "Inventory item updated" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM inventory WHERE id = ?", [req.params.id]);
    res.json({ message: "Inventory item deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
