const pool = require("./db");

const hotelCategories = [
  ["Breakfast", "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80"],
  ["South Indian", "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80"],
  ["North Indian", "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80"],
  ["Starters", "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80"],
  ["Soups", "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80"],
  ["Salads", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"],
  ["Pizza", "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=80"],
  ["Burger", "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80"],
  ["Sandwich", "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80"],
  ["Chinese", "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80"],
  ["Rice & Biryani", "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=900&q=80"],
  ["Thali", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80"],
  ["Tandoor", "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80"],
  ["Breads", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80"],
  ["Drinks", "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"],
  ["Mocktails", "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80"],
  ["Desserts", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80"]
];

async function addColumnIfMissing(table, column, definition) {
  try {
    await pool.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  } catch (error) {
    if (error.code !== "ER_DUP_FIELDNAME") {
      throw error;
    }
  }
}

async function setupDatabase() {
  await addColumnIfMissing("categories", "image_url", "TEXT");
  await addColumnIfMissing("menu_items", "image_url", "TEXT");

  for (const [name, imageUrl] of hotelCategories) {
    const [rows] = await pool.query("SELECT id, image_url FROM categories WHERE name = ? LIMIT 1", [name]);

    if (rows[0]) {
      if (!rows[0].image_url) {
        await pool.query("UPDATE categories SET image_url = ? WHERE id = ?", [imageUrl, rows[0].id]);
      }
    } else {
      await pool.query("INSERT INTO categories (name, image_url) VALUES (?, ?)", [name, imageUrl]);
    }
  }
}

module.exports = setupDatabase;
