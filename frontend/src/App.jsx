import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Plus,
  ReceiptText,
  RefreshCcw,
  Store,
  Trash2,
  Truck,
  UserPlus,
  Users,
  Utensils
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { api, clearSession, getToken, getUser, saveSession } from "./services/api";

const money = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));

const images = {
  auth: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80",
  dashboard: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  menu: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80",
  inventory: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  pos: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
  vendors: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80",
  staff: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80",
  customers: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80",
  waste: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80",
  reports: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
};

const foodImages = {
  "Margherita Pizza": "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
  "Cheese Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  "Veg Burger": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  "Cold Coffee": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
  "Paneer Tikka": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
  "Masala Dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
  "Chocolate Brownie": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
  "Veg Thali": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  "Manchurian": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  "Tomato Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  "Club Sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80"
};

const categoryImages = {
  Breakfast: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
  "South Indian": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
  "North Indian": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
  Starters: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
  Soups: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  Salads: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  Pizza: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
  Burger: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  Sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  Chinese: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  "Rice & Biryani": "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=800&q=80",
  Thali: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  Tandoor: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
  Breads: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
  Drinks: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
  Mocktails: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
  Desserts: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
};

const fallbackFoodImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";

function getMenuImage(item) {
  return (
    item.image_url ||
    foodImages[item.name] ||
    item.category_image_url ||
    categoryImages[item.category_name] ||
    fallbackFoodImage
  );
}

const roleAccess = {
  admin: ["dashboard", "menu", "inventory", "pos", "vendors", "staff", "customers", "waste", "reports"],
  owner: ["dashboard", "menu", "inventory", "pos", "vendors", "staff", "customers", "waste", "reports"],
  manager: ["dashboard", "menu", "inventory", "pos", "vendors", "staff", "customers", "waste", "reports"],
  chef: ["dashboard", "menu", "inventory", "waste"],
  cashier: ["dashboard", "pos", "customers", "reports"],
  waiter: ["dashboard", "menu", "pos", "customers"]
};

const roleWork = {
  admin: "Full system control for setup, users and all restaurant modules.",
  owner: "Business view: sales, profit, menu, inventory, staff, vendors and reports.",
  manager: "Daily operations: menu, stock, staff, customers, orders and reports.",
  chef: "Kitchen view: menu, ingredients and food waste control.",
  cashier: "Billing view: create bills, take payments and check sales reports.",
  waiter: "Table service view: check menu, take table orders and manage customers."
};

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "owner@kitcheniq.com",
    password: "password123",
    role: "owner"
  });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        await api("/auth/register", {
          method: "POST",
          body: JSON.stringify(form)
        });
      }

      const session = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      saveSession(session);
      onLogin(session.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="brand-mark">
            <Utensils size={24} />
          </span>
          <h1>KitchenIQ</h1>
          <p>Restaurant ERP for orders, billing, menu, inventory, staff, reports and future AI planning.</p>
          <div className="auth-highlights">
            <span>Live POS</span>
            <span>Inventory</span>
            <span>Reports</span>
          </div>
        </div>

        <form onSubmit={submit} className="auth-form">
          <div className="mode-switch">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {mode === "register" && (
            <>
              <label>
                Name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label>
                Role
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="chef">Chef</option>
                  <option value="cashier">Cashier</option>
                  <option value="waiter">Waiter</option>
                </select>
              </label>
            </>
          )}

          <label>
            Email
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="primary-btn" type="submit">
            {mode === "register" ? <UserPlus size={18} /> : <LayoutDashboard size={18} />}
            {mode === "register" ? "Create account" : "Open dashboard"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Layout({ user, page, setPage, onLogout, children }) {
  const allNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "menu", label: "Menu", icon: MenuIcon },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "pos", label: "POS Billing", icon: ReceiptText },
    { id: "vendors", label: "Vendors", icon: Truck },
    { id: "staff", label: "Staff", icon: Users },
    { id: "customers", label: "Customers", icon: Store },
    { id: "waste", label: "Food Waste", icon: ClipboardList },
    { id: "reports", label: "Reports", icon: BarChart3 }
  ];
  const allowed = roleAccess[user?.role] || roleAccess.owner;
  const nav = allNav.filter((item) => allowed.includes(item.id));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Utensils />
          <div>
            <strong>KitchenIQ</strong>
            <span>{user?.role || "owner"}</span>
          </div>
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => setPage(item.id)}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button className="logout" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <section className="main-area">
        <div className="page-animate">{children}</div>
      </section>
    </div>
  );
}

function PageHeader({ title, subtitle, action, image, kicker }) {
  return (
    <header className="page-header hero-strip" style={{ backgroundImage: `linear-gradient(90deg, rgba(10, 32, 27, .84), rgba(10, 32, 27, .35)), url(${image})` }}>
      <div>
        {kicker && <span className="kicker">{kicker}</span>}
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

function Dashboard({ user }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setData(await api("/dashboard"));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const cards = data?.cards || {};

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={roleWork[user?.role] || roleWork.owner}
        image={images.dashboard}
        kicker={`${user?.role || "Owner"} workspace`}
        action={
          <button className="ghost-btn" onClick={load}>
            <RefreshCcw size={16} />
            Refresh
          </button>
        }
      />
      {error && <p className="error">{error}</p>}
      <section className="role-flow">
        <h3>Your Work Flow</h3>
        <p>{getRoleFlow(user?.role)}</p>
      </section>
      <div className="metric-grid">
        <Metric label="Today's Sales" value={money(cards.todaysSales)} tone="teal" />
        <Metric label="Estimated Profit" value={money(cards.todaysProfit)} tone="orange" />
        <Metric label="Orders" value={cards.orders || 0} tone="green" />
        <Metric label="Inventory Cost" value={money(cards.inventoryCost)} tone="blue" />
        <Metric label="Menu Items" value={cards.menuItems || 0} tone="red" />
      </div>
      <div className="two-column">
        <section className="panel glass-panel">
          <h3>Recent Orders</h3>
          <DataTable
            columns={["ID", "Table", "Total", "Payment", "Status"]}
            rows={(data?.recentOrders || []).map((order) => [
              `#${order.id}`,
              order.table_number || "-",
              money(order.total_amount),
              order.payment_method,
              order.status
            ])}
          />
        </section>
        <section className="panel visual-panel">
          <h3>Top Items</h3>
          <div className="bar-list">
            {(data?.topItems || []).map((item) => (
              <div className="bar-row" key={item.name}>
                <span>{item.name}</span>
                <div><b style={{ width: `${Math.min(Number(item.sold || 0) * 18, 100)}%` }} /></div>
                <strong>{item.sold}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function getRoleFlow(role) {
  const flows = {
    owner: "First add menu and inventory. Then staff can create bills in POS. Dashboard and reports update automatically from real orders.",
    manager: "Check dashboard, update menu and inventory, manage staff/vendors/customers, then review reports.",
    cashier: "Open POS Billing, select customer food, enter table number, generate bill, then collect Cash/Card/UPI payment.",
    waiter: "See menu, take the table order, add items in POS Billing, and send the bill/order to cashier.",
    chef: "Check menu and stock, prepare food from orders, and record food waste when ingredients expire or food is over-prepared.",
    admin: "Set up and monitor the whole restaurant system from one place."
  };
  return flows[role] || flows.owner;
}

function Metric({ label, value, tone }) {
  return (
    <article className={`metric ${tone || ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No data yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", category_id: "", price: "", cost_price: "", image_url: "" });
  const [newCatName, setNewCatName] = useState("");
  const [error, setError] = useState("");
  const [catError, setCatError] = useState("");

  async function load() {
    setItems(await api("/menu/items"));
    setCategories(await api("/menu/categories"));
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (!form.name || !form.price) {
      setError("Name and Price are required");
      return;
    }
    try {
      await api("/menu/items", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", category_id: "", price: "", cost_price: "", image_url: "" });
      setError("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addCategory(event) {
    event.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api("/menu/categories", {
        method: "POST",
        body: JSON.stringify({ name: newCatName, image_url: categoryImages[newCatName] || "" })
      });
      setNewCatName("");
      setCatError("");
      await load();
    } catch (err) {
      setCatError(err.message);
    }
  }

  async function remove(id) {
    await api(`/menu/items/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <PageHeader title="Menu Management" subtitle="Build a photo-rich menu with selling price, cost price and profit." image={images.menu} kicker="Food catalog" />
      {error && <p className="error" style={{ marginBottom: "14px" }}>{error}</p>}
      
      <div className="menu-forms-grid">
        <section className="form-section">
          <h4>Add New Category</h4>
          <form className="inline-form compact-form" onSubmit={addCategory}>
            <input 
              placeholder="Category (e.g., Soups)" 
              value={newCatName} 
              onChange={(e) => setNewCatName(e.target.value)} 
            />
            <button className="ghost-btn" type="submit">
              <Plus size={16} />
              Add
            </button>
          </form>
          {catError && <p className="error small-error">{catError}</p>}
        </section>

        <section className="form-section">
          <h4>Add Menu Item</h4>
          <div className="help-note">
            <strong>Hotel example:</strong> Selling price is what customer pays. Cost is what restaurant spends to make it.
            If pizza sells at Rs 249 and cost is Rs 95, profit is Rs 154.
          </div>
          <form className="inline-form" onSubmit={submit}>
            <input placeholder="Food name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input
              placeholder="Cost"
              value={form.cost_price}
              onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
            />
            <input
              placeholder="Image URL optional"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
            <button className="primary-btn" type="submit">
              <Plus size={16} />
              Add Item
            </button>
          </form>
        </section>
      </div>
      <section className="menu-gallery">
        {items.map((item) => (
          <article className="menu-card" key={item.id}>
            <img src={getMenuImage(item)} alt={item.name} />
            <div>
              <span>{item.category_name || "Kitchen"}</span>
              <h3>{item.name}</h3>
              <p>Cost {money(item.cost_price)} | Profit {money(Number(item.price) - Number(item.cost_price))}</p>
              <strong>{money(item.price)}</strong>
              <button className="icon-btn" onClick={() => remove(item.id)} title="Delete item">
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", unit: "kg", quantity: "", unit_cost: "", reorder_level: "" });

  async function load() {
    setItems(await api("/inventory"));
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event) {
    event.preventDefault();
    await api("/inventory", { method: "POST", body: JSON.stringify(form) });
    setForm({ name: "", unit: "kg", quantity: "", unit_cost: "", reorder_level: "" });
    await load();
  }

  async function remove(id) {
    await api(`/inventory/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <PageHeader title="Inventory" subtitle="Track ingredients, stock value, low stock and reorder level." image={images.inventory} kicker="Store room" />
      <form className="inline-form" onSubmit={submit}>
        <input placeholder="Ingredient" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        <input placeholder="Qty" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <input
          placeholder="Unit cost"
          value={form.unit_cost}
          onChange={(e) => setForm({ ...form, unit_cost: e.target.value })}
        />
        <input
          placeholder="Reorder"
          value={form.reorder_level}
          onChange={(e) => setForm({ ...form, reorder_level: e.target.value })}
        />
        <button className="primary-btn" type="submit">
          <Plus size={16} />
          Add
        </button>
      </form>
      <section className="panel image-table">
        <DataTable
          columns={["Ingredient", "Qty", "Unit Cost", "Total", "Reorder", ""]}
          rows={items.map((item) => {
            const isLow = Number(item.quantity) <= Number(item.reorder_level);
            return [
              item.name,
              <span className={isLow ? "low-stock-alert" : ""}>
                {item.quantity} {item.unit}
                {isLow && <span className="low-stock-badge">Low</span>}
              </span>,
              money(item.unit_cost),
              money(Number(item.quantity) * Number(item.unit_cost)),
              item.reorder_level,
              <button className="icon-btn" onClick={() => remove(item.id)} title="Delete ingredient">
                <Trash2 size={16} />
              </button>
            ];
          })}
        />
      </section>
    </>
  );
}

function PosPage() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState("1");
  const [discount, setDiscount] = useState("0");
  const [message, setMessage] = useState("");
  const [lastBill, setLastBill] = useState(null);

  useEffect(() => {
    api("/menu/items").then(setMenu);
  }, []);

  function add(item) {
    const existing = cart.find((cartItem) => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  }

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart]
  );
  const tax = ((subtotal - Number(discount || 0)) * 5) / 100;
  const total = subtotal - Number(discount || 0) + tax;

  async function createBill() {
    try {
      const result = await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          table_number: tableNumber,
          discount,
          items: cart.map((item) => ({ menu_item_id: item.id, quantity: item.quantity }))
        })
      });
      
      const fullOrder = await api(`/orders/${result.id}`);
      setLastBill(fullOrder);
      setMessage(`Bill #${result.id} created successfully!`);
      setCart([]);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  function resetBill() {
    setLastBill(null);
    setMessage("");
    setTableNumber("1");
    setDiscount("0");
  }

  return (
    <>
      <PageHeader title="POS Billing" subtitle="Select food photos, build a bill, apply GST and save the order." image={images.pos} kicker="Live cashier" />
      <div className="pos-grid">
        <section className="panel item-grid pos-items">
          {menu.map((item) => (
            <button key={item.id} className="food-button" onClick={() => add(item)}>
              <img src={getMenuImage(item)} alt={item.name} />
              <strong>{item.name}</strong>
              <span>{money(item.price)}</span>
            </button>
          ))}
        </section>
        <section className="panel bill-panel receipt-card">
          <h3>Current Bill</h3>
          <label>
            Table
            <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} disabled={!!lastBill} />
          </label>
          {cart.map((item) => (
            <div className="bill-line" key={item.id}>
              <span>{item.name}</span>
              <strong>
                {item.quantity} x {money(item.price)}
              </strong>
            </div>
          ))}
          <label>
            Discount
            <input value={discount} onChange={(e) => setDiscount(e.target.value)} disabled={!!lastBill} />
          </label>
          <div className="totals">
            <span>Subtotal {money(subtotal)}</span>
            <span>GST 5% {money(tax)}</span>
            <strong>Total {money(total)}</strong>
          </div>
          
          {message && <p className={message.startsWith("Error") ? "error" : "success"}>{message}</p>}
          
          {lastBill ? (
            <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
              <button className="primary-btn" onClick={() => window.print()}>
                <ReceiptText size={16} />
                Print Receipt
              </button>
              <button className="ghost-btn" onClick={resetBill}>
                New Bill
              </button>
            </div>
          ) : (
            <button className="primary-btn" disabled={!cart.length} onClick={createBill}>
              <ReceiptText size={16} />
              Generate Bill
            </button>
          )}
        </section>
      </div>

      {lastBill && (
        <div className="print-receipt-only">
          <div className="receipt-header">
            <h2>KitchenIQ</h2>
            <p>Delicious food, smart management</p>
            <hr style={{ borderTop: "1px dashed #000", borderBottom: "none", margin: "10px 0" }} />
          </div>
          <div className="receipt-meta">
            <p><strong>Order ID:</strong> #{lastBill.id}</p>
            <p><strong>Table:</strong> {lastBill.table_number || "Takeaway"}</p>
            <p><strong>Date:</strong> {new Date(lastBill.created_at).toLocaleString("en-IN")}</p>
          </div>
          <table className="receipt-items-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Item</th>
                <th style={{ textAlign: "center" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {lastBill.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>{money(item.price)}</td>
                  <td style={{ textAlign: "right" }}>{money(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="receipt-summary">
            <div><span>Subtotal:</span> <span>{money(lastBill.subtotal)}</span></div>
            {Number(lastBill.discount) > 0 && (
              <div><span>Discount:</span> <span>-{money(lastBill.discount)}</span></div>
            )}
            <div><span>GST (5%):</span> <span>{money(lastBill.tax)}</span></div>
            <div className="receipt-grand-total">
              <span>Grand Total:</span> <span>{money(lastBill.total_amount)}</span>
            </div>
          </div>
          <div className="receipt-footer">
            <hr style={{ borderTop: "1px dashed #000", borderBottom: "none", margin: "10px 0" }} />
            <p>Thank you for dining with us!</p>
            <p>Please visit again</p>
          </div>
        </div>
      )}
    </>
  );
}

function ReportsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api("/reports/daily").then(setRows);
  }, []);

  return (
    <>
      <PageHeader title="Reports" subtitle="Daily sales, order count and estimated profit with real order data." image={images.reports} kicker="Analytics" />
      <section className="panel visual-panel">
        <div className="report-bars">
          {rows.slice(0, 7).map((row) => (
            <div key={row.day}>
              <span>{new Date(row.day).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
              <b style={{ height: `${Math.max(20, Math.min(Number(row.sales || 0) / 80, 180))}px` }} />
              <strong>{money(row.sales)}</strong>
            </div>
          ))}
        </div>
        <DataTable
          columns={["Day", "Orders", "Sales", "Estimated Profit"]}
          rows={rows.map((row) => [
            new Date(row.day).toLocaleDateString(),
            row.orders,
            money(row.sales),
            money(row.estimated_profit)
          ])}
        />
      </section>
    </>
  );
}

const simpleModuleConfig = {
  vendors: {
    title: "Vendors",
    subtitle: "Save supplier name, phone and address.",
    endpoint: "/vendors",
    image: images.vendors,
    kicker: "Suppliers",
    fields: [
      { name: "name", label: "Vendor name" },
      { name: "phone", label: "Phone" },
      { name: "address", label: "Address" }
    ],
    columns: ["Name", "Phone", "Address"],
    row: (item) => [item.name, item.phone || "-", item.address || "-"]
  },
  staff: {
    title: "Staff",
    subtitle: "Track chefs, waiters, cashiers and salaries.",
    endpoint: "/staff",
    image: images.staff,
    kicker: "Team",
    fields: [
      { name: "name", label: "Staff name" },
      { name: "role", label: "Role" },
      { name: "phone", label: "Phone" },
      { name: "salary", label: "Salary" }
    ],
    columns: ["Name", "Role", "Phone", "Salary"],
    row: (item) => [item.name, item.role || "-", item.phone || "-", money(item.salary)]
  },
  customers: {
    title: "Customers",
    subtitle: "Store visits and loyalty points.",
    endpoint: "/customers",
    image: images.customers,
    kicker: "Loyalty",
    fields: [
      { name: "name", label: "Customer name" },
      { name: "phone", label: "Phone" },
      { name: "visits", label: "Visits" },
      { name: "points", label: "Points" }
    ],
    columns: ["Name", "Phone", "Visits", "Points"],
    row: (item) => [item.name, item.phone || "-", item.visits || 0, item.points || 0]
  },
  waste: {
    title: "Food Waste",
    subtitle: "Record wasted food, cost and reason.",
    endpoint: "/waste",
    image: images.waste,
    kicker: "Waste control",
    fields: [
      { name: "item_name", label: "Item" },
      { name: "quantity", label: "Quantity" },
      { name: "cost", label: "Cost" },
      { name: "reason", label: "Reason" }
    ],
    columns: ["Item", "Quantity", "Cost", "Reason"],
    row: (item) => [item.item_name, item.quantity, money(item.cost), item.reason || "-"]
  }
};

function SimpleModulePage({ type }) {
  const config = simpleModuleConfig[type];
  const emptyForm = Object.fromEntries(config.fields.map((field) => [field.name, ""]));
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setRows(await api(config.endpoint));
  }

  useEffect(() => {
    load();
  }, [type]);

  async function submit(event) {
    event.preventDefault();
    await api(config.endpoint, { method: "POST", body: JSON.stringify(form) });
    setForm(emptyForm);
    await load();
  }

  async function remove(id) {
    await api(`${config.endpoint}/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <PageHeader title={config.title} subtitle={config.subtitle} image={config.image} kicker={config.kicker} />
      <form className="inline-form" onSubmit={submit}>
        {config.fields.map((field) => (
          <input
            key={field.name}
            placeholder={field.label}
            value={form[field.name]}
            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
          />
        ))}
        <button className="primary-btn" type="submit">
          <Plus size={16} />
          Add
        </button>
      </form>
      <section className="panel">
        <DataTable
          columns={[...config.columns, ""]}
          rows={rows.map((item) => [
            ...config.row(item),
            <button className="icon-btn" onClick={() => remove(item.id)} title="Delete record">
              <Trash2 size={16} />
            </button>
          ])}
        />
      </section>
    </>
  );
}

function App() {
  const [user, setUser] = useState(getUser());
  const [page, setPage] = useState("dashboard");

  if (!getToken()) {
    return <AuthScreen onLogin={setUser} />;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const allowedPages = roleAccess[user?.role] || roleAccess.owner;
  const activePage = allowedPages.includes(page) ? page : "dashboard";

  const pages = {
    dashboard: <Dashboard user={user} />,
    menu: <MenuPage />,
    inventory: <InventoryPage />,
    pos: <PosPage />,
    vendors: <SimpleModulePage type="vendors" />,
    staff: <SimpleModulePage type="staff" />,
    customers: <SimpleModulePage type="customers" />,
    waste: <SimpleModulePage type="waste" />,
    reports: <ReportsPage />
  };

  return (
    <Layout user={user} page={activePage} setPage={setPage} onLogout={logout}>
      {pages[activePage]}
    </Layout>
  );
}

export default App;
