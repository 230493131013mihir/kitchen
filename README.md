# KitchenIQ

KitchenIQ is a beginner-friendly restaurant ERP project with:

- Login and register
- Dashboard
- Menu management
- Inventory management
- POS billing
- Daily reports
- MySQL database schema

## Folder Structure

```text
kitchen/
  backend/
  frontend/
```

## Step 1: Create the Database

Open MySQL and run this file:

```text
backend/database/schema.sql
```

That creates the `kitcheniq` database and starter tables.

## Step 2: Backend Setup

Open terminal in `backend`:

```bash
npm install
copy .env.example .env
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

If your MySQL password is not blank, edit `backend/.env`.

## Step 3: Frontend Setup

Open another terminal in `frontend`:

```bash
npm install
copy .env.example .env
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

## Step 4: First Login

Click `Register`, create an owner account, then the app opens the dashboard.

Example:

```text
Name: Mihir
Email: owner@kitcheniq.com
Password: password123
Role: Owner
```

## Optional Demo Data

If you want sample restaurant data only for learning, import:

```text
backend/database/demo-data.sql
```

This adds sample menu, inventory, staff, customers and orders. It does not create a login account; create your own account from Register.

## Open On Phone

Your laptop and phone must be on the same Wi-Fi/hotspot. Start frontend with:

```bash
npm run dev
```

Then open this on your phone:

```text
http://YOUR-LAPTOP-IP:5173
```

If Vite says it used another port, such as `5174`, use that port instead.

## What To Build Next

After this version works, add these modules one by one:

1. Staff
2. Vendors
3. Customers
4. Food waste
5. Recipe costing
6. PDF invoice
7. Excel export
8. AI prediction
