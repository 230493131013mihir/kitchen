USE kitcheniq;

INSERT INTO categories (id, name) VALUES
  (1, 'Pizza'),
  (2, 'Burger'),
  (3, 'Drinks'),
  (4, 'Starters')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO menu_items (id, category_id, name, price, cost_price, is_available) VALUES
  (1, 1, 'Margherita Pizza', 249, 95, true),
  (2, 2, 'Veg Burger', 129, 45, true),
  (3, 3, 'Cold Coffee', 99, 35, true),
  (4, 4, 'Paneer Tikka', 219, 88, true)
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  name = VALUES(name),
  price = VALUES(price),
  cost_price = VALUES(cost_price),
  is_available = VALUES(is_available);

INSERT INTO inventory (id, name, unit, quantity, unit_cost, reorder_level) VALUES
  (1, 'Tomato', 'kg', 20, 35, 5),
  (2, 'Onion', 'kg', 15, 28, 5),
  (3, 'Cheese', 'kg', 8, 260, 2),
  (4, 'Bread', 'pack', 12, 45, 4),
  (5, 'Milk', 'liter', 18, 62, 5)
ON DUPLICATE KEY UPDATE
  quantity = VALUES(quantity),
  unit_cost = VALUES(unit_cost),
  reorder_level = VALUES(reorder_level);

INSERT IGNORE INTO vendors (id, name, phone, address) VALUES
  (1, 'Fresh Farm Suppliers', '9876543210', 'APMC Market'),
  (2, 'Daily Dairy House', '9876501234', 'Main Road');

INSERT IGNORE INTO staff (id, name, role, phone, salary) VALUES
  (1, 'Raj Patel', 'Chef', '9900011111', 30000),
  (2, 'Asha Sharma', 'Cashier', '9900022222', 22000),
  (3, 'Vivek Mehta', 'Waiter', '9900033333', 18000);

INSERT IGNORE INTO customers (id, name, phone, visits, points) VALUES
  (1, 'Rohan Desai', '9811111111', 12, 240),
  (2, 'Priya Shah', '9822222222', 8, 160);

INSERT IGNORE INTO food_waste (id, item_name, quantity, cost, reason) VALUES
  (1, 'Cheese', 0.8, 208, 'Expired batch'),
  (2, 'Tomato', 1.5, 52.5, 'Over-prep');

INSERT INTO orders (id, table_number, subtotal, discount, tax, total_amount, payment_method, status, user_id, created_at) VALUES
  (1, 'T1', 627, 20, 30.35, 637.35, 'UPI', 'paid', NULL, NOW()),
  (2, 'T4', 497, 0, 24.85, 521.85, 'Cash', 'paid', NULL, NOW())
ON DUPLICATE KEY UPDATE total_amount = VALUES(total_amount), created_at = VALUES(created_at);

INSERT IGNORE INTO order_items (order_id, menu_item_id, quantity, price, line_total) VALUES
  (1, 1, 2, 249, 498),
  (1, 3, 1, 99, 99),
  (1, 2, 1, 129, 129),
  (2, 4, 1, 219, 219),
  (2, 2, 1, 129, 129);
