const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

const modules = {
  vendors: {
    table: "vendors",
    fields: ["name", "phone", "address"]
  },
  staff: {
    table: "staff",
    fields: ["name", "role", "phone", "salary"]
  },
  customers: {
    table: "customers",
    fields: ["name", "phone", "visits", "points"]
  },
  waste: {
    table: "food_waste",
    fields: ["item_name", "quantity", "cost", "reason"]
  }
};

function getModule(req, res) {
  const module = modules[req.params.module];
  if (!module) {
    res.status(404).json({ message: "Module not found" });
    return null;
  }
  return module;
}

router.get("/:module", async (req, res, next) => {
  try {
    const module = getModule(req, res);
    if (!module) return;

    const [rows] = await pool.query(`SELECT * FROM ${module.table} ORDER BY id DESC`);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/:module", async (req, res, next) => {
  try {
    const module = getModule(req, res);
    if (!module) return;

    const values = module.fields.map((field) => req.body[field] ?? null);
    const placeholders = module.fields.map(() => "?").join(", ");

    const [result] = await pool.query(
      `INSERT INTO ${module.table} (${module.fields.join(", ")}) VALUES (${placeholders})`,
      values
    );

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    next(error);
  }
});

router.delete("/:module/:id", async (req, res, next) => {
  try {
    const module = getModule(req, res);
    if (!module) return;

    await pool.query(`DELETE FROM ${module.table} WHERE id = ?`, [req.params.id]);
    res.json({ message: "Record deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
