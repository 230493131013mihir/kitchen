const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/", async (_req, res, next) => {
  try {
    const [[sales]] = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS value
      FROM orders
      WHERE DATE(created_at) = CURDATE()
    `);
    const [[orders]] = await pool.query(`
      SELECT COUNT(*) AS value
      FROM orders
      WHERE DATE(created_at) = CURDATE()
    `);
    const [[inventory]] = await pool.query(`
      SELECT COALESCE(SUM(quantity * unit_cost), 0) AS value
      FROM inventory
    `);
    const [[menuItems]] = await pool.query("SELECT COUNT(*) AS value FROM menu_items");
    const [recentOrders] = await pool.query(`
      SELECT id, table_number, total_amount, payment_method, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);
    const [topItems] = await pool.query(`
      SELECT mi.name, COALESCE(SUM(oi.quantity), 0) AS sold
      FROM menu_items mi
      LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
      GROUP BY mi.id
      ORDER BY sold DESC
      LIMIT 5
    `);

    res.json({
      cards: {
        todaysSales: Number(sales.value),
        todaysProfit: Number(sales.value) * 0.35,
        orders: Number(orders.value),
        inventoryCost: Number(inventory.value),
        menuItems: Number(menuItems.value)
      },
      recentOrders,
      topItems
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
