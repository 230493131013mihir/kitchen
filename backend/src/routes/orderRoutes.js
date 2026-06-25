const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/", async (_req, res, next) => {
  try {
    const [orders] = await pool.query(`
      SELECT * FROM orders
      ORDER BY created_at DESC
      LIMIT 50
    `);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const {
      table_number,
      items,
      discount = 0,
      tax_rate = 5,
      payment_method = "UPI",
      status = "paid"
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Add at least one item" });
    }

    await connection.beginTransaction();

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const [menuRows] = await connection.query("SELECT id, price FROM menu_items WHERE id = ?", [
        item.menu_item_id
      ]);
      const menuItem = menuRows[0];
      if (!menuItem) throw new Error("Menu item not found");

      const quantity = Number(item.quantity || 1);
      const lineTotal = Number(menuItem.price) * quantity;
      subtotal += lineTotal;
      orderItems.push({ menu_item_id: menuItem.id, quantity, price: menuItem.price, lineTotal });
    }

    const tax = ((subtotal - Number(discount)) * Number(tax_rate)) / 100;
    const total = subtotal - Number(discount) + tax;

    const [orderResult] = await connection.query(
      `INSERT INTO orders
        (table_number, subtotal, discount, tax, total_amount, payment_method, status, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [table_number || null, subtotal, discount, tax, total, payment_method, status, req.user.id]
    );

    for (const item of orderItems) {
      await connection.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, price, line_total) VALUES (?, ?, ?, ?, ?)",
        [orderResult.insertId, item.menu_item_id, item.quantity, item.price, item.lineTotal]
      );
    }

    await connection.commit();
    res.status(201).json({ id: orderResult.insertId, subtotal, discount, tax, total_amount: total });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    const [items] = await pool.query(
      `SELECT oi.*, mi.name
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    if (!orders[0]) return res.status(404).json({ message: "Order not found" });
    res.json({ ...orders[0], items });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
