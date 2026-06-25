const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/daily", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        DATE(created_at) AS day,
        COUNT(*) AS orders,
        COALESCE(SUM(total_amount), 0) AS sales,
        COALESCE(SUM(total_amount) * 0.35, 0) AS estimated_profit
      FROM orders
      GROUP BY DATE(created_at)
      ORDER BY day DESC
      LIMIT 30
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
