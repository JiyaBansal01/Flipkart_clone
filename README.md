# 🛒 Flipkart Clone — Full-Stack E-Commerce App

A fully functional e-commerce web application inspired by Flipkart's design and user experience.

**Tech Stack:** React.js + FastAPI (Python) + MySQL

---

## 📁 Project Folder Structure

```
flipkart-clone/
│
├── frontend/                          ← React.js Application
│   ├── public/
│   │   └── index.html                 ← HTML shell (React mounts here)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.js          ← Top navigation bar + category strip
│   │   │   │   └── Navbar.css
│   │   │   └── ProductCard/
│   │   │       ├── ProductCard.js     ← Individual product tile
│   │   │       └── ProductCard.css
│   │   ├── context/
│   │   │   ├── CartContext.js         ← Global cart state (shared across all pages)
│   │   │   └── WishlistContext.js     ← Global wishlist state
│   │   ├── pages/
│   │   │   ├── HomePage.js            ← Landing page with banner + products
│   │   │   ├── HomePage.css
│   │   │   ├── ProductListPage.js     ← Search, filter, browse products
│   │   │   ├── ProductListPage.css
│   │   │   ├── ProductDetailPage.js   ← Product detail with image carousel
│   │   │   ├── ProductDetailPage.css
│   │   │   ├── CartPage.js            ← Shopping cart
│   │   │   ├── CartPage.css
│   │   │   ├── CheckoutPage.js        ← Address form + payment + order summary
│   │   │   ├── CheckoutPage.css
│   │   │   ├── OrderConfirmationPage.js  ← Success page after order
│   │   │   ├── OrderConfirmationPage.css
│   │   │   ├── OrderHistoryPage.js    ← All past orders
│   │   │   └── WishlistPage.js        ← Saved/wishlisted products
│   │   ├── utils/
│   │   │   └── api.js                 ← All API calls to backend
│   │   ├── styles/
│   │   │   └── global.css             ← Global CSS variables + base styles
│   │   ├── App.js                     ← Root component + routing
│   │   └── index.js                   ← React entry point
│   └── package.json                   ← Node dependencies
│
├── backend/                           ← FastAPI Python Application
│   ├── main.py                        ← App entry point, middleware, route registration
│   ├── requirements.txt               ← Python dependencies
│   ├── .env.example                   ← Environment variables template
│   ├── database/
│   │   ├── connection.py              ← MySQL connection + SQLAlchemy session
│   │   ├── schema.sql                 ← SQL to CREATE all tables
│   │   └── seed.sql                   ← Sample data to INSERT
│   ├── models/
│   │   └── models.py                  ← SQLAlchemy ORM table definitions
│   ├── schemas/
│   │   └── schemas.py                 ← Pydantic request/response validation
│   └── routers/
│       ├── products.py                ← GET /api/products (list, detail, search)
│       ├── categories.py              ← GET /api/categories
│       ├── cart.py                    ← GET/POST/PUT/DELETE /api/cart
│       ├── orders.py                  ← POST /api/orders/place, GET /api/orders
│       ├── users.py                   ← GET /api/users/me
│       └── wishlist.py                ← GET/POST /api/wishlist
│
└── README.md                          ← This file
```

---

## 🗄️ Database Schema Design

Here's how the 8 tables relate to each other:

```
categories (1) ──────── (many) products
products   (1) ──────── (many) product_images
products   (1) ──────── (many) cart_items
products   (1) ──────── (many) order_items
products   (1) ──────── (many) wishlist_items
users      (1) ──────── (many) cart_items
users      (1) ──────── (many) orders
users      (1) ──────── (many) addresses
users      (1) ──────── (many) wishlist_items
orders     (1) ──────── (many) order_items
```

**Key Design Decisions:**
- `products.specifications` is stored as **JSON** to handle varying specs per category
- `orders.shipping_address_snapshot` is a **JSON snapshot** so address changes don't affect old orders
- `order_items` stores `unit_price` at time of purchase (price history)
- `cart_items` supports both logged-in users (user_id) and guests (session_id)

---

## 🔌 API Endpoints Reference

| Method | URL | What it does |
|--------|-----|--------------|
| GET | `/api/products` | List products (supports `?search=&category_slug=&min_price=&max_price=&sort_by=&page=`) |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/slug/{slug}` | Get product by slug |
| GET | `/api/categories` | Get all categories |
| GET | `/api/cart` | Get current cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/{item_id}` | Update quantity |
| DELETE | `/api/cart/{item_id}` | Remove item |
| DELETE | `/api/cart/clear` | Clear entire cart |
| POST | `/api/orders/place` | Place an order |
| GET | `/api/orders` | Get order history |
| GET | `/api/orders/{id}` | Get single order |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist/toggle/{product_id}` | Add/Remove from wishlist |
| GET | `/api/users/me` | Get current user |

📖 **Auto-generated docs available at:** `http://localhost:8000/docs`

---

## ⚙️ Step-by-Step Setup Instructions

### Prerequisites — Install These First

Before starting, make sure you have:
- **Node.js** (v18 or higher) → https://nodejs.org
- **Python** (v3.10 or higher) → https://python.org
- **MySQL** (v8.0 or higher) → https://dev.mysql.com/downloads/

Verify they're installed:
```bash
node --version      # Should show v18.x.x or higher
python --version    # Should show 3.10.x or higher
mysql --version     # Should show 8.0.x or higher
```

---

### Step 1: Set Up MySQL Database

**Option A: Using MySQL Command Line**
```bash
# Open MySQL terminal (enter your root password when asked)
mysql -u root -p

# Run these commands inside MySQL:
CREATE DATABASE flipkart_clone;
EXIT;

# Now run our schema file to create tables:
mysql -u root -p flipkart_clone < backend/database/schema.sql

# Load sample product data:
mysql -u root -p flipkart_clone < backend/database/seed.sql
```

**Option B: Using MySQL Workbench (GUI)**
1. Open MySQL Workbench
2. Connect to your local server
3. Go to **File → Open SQL Script** → select `backend/database/schema.sql` → Run
4. Open `backend/database/seed.sql` → Run

---

### Step 2: Set Up the Backend (FastAPI)

```bash
# Navigate to the backend folder
cd flipkart-clone/backend

# Create a Python virtual environment
# (This is like a separate workspace for this project's packages)
python -m venv venv

# Activate the virtual environment:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install all required Python packages
pip install -r requirements.txt

# Create your environment config file
cp .env.example .env

# Edit .env with your MySQL password:
# Open .env in any text editor and change:
# DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/flipkart_clone
```

**Edit the `.env` file:**
```env
DATABASE_URL=mysql+pymysql://root:your_actual_password@localhost:3306/flipkart_clone
SECRET_KEY=any-random-secret-string-here
```

**Start the backend server:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ Test it: Open `http://localhost:8000/docs` in your browser → You should see the API documentation.

---

### Step 3: Set Up the Frontend (React)

Open a **new terminal window** (keep the backend running):

```bash
# Navigate to the frontend folder
cd flipkart-clone/frontend

# Install all React dependencies
# (This reads package.json and installs everything)
npm install

# Start the React development server
npm start
```

The browser should open automatically at `http://localhost:3000`.

If it doesn't, open it manually: `http://localhost:3000`

---

### Step 4: Verify Everything Works

1. **Homepage loads** with product grid → ✅ Frontend + Backend connected
2. **Click a product** → Product detail page shows → ✅ Products API working
3. **Add to Cart** → Cart count in navbar updates → ✅ Cart API working
4. **Search for "Samsung"** → Results filter → ✅ Search working
5. **Go to Cart → Checkout → Place Order** → Confirmation page → ✅ Orders API working

---

## 🧩 How Each Module Works

### Frontend Modules

#### `context/CartContext.js`
The "brain" of the cart. Uses React Context API to share cart data across ALL components without manually passing data through props.
```
CartProvider (wraps entire app)
    └── Any component can call useCart() to:
            - Read cart.items, cart.subtotal
            - Call addToCart(productId, qty)
            - Call removeFromCart(itemId)
            - Call updateCartItem(itemId, qty)
```

#### `utils/api.js`
Centralized place for all API calls using Axios. If you change the backend URL, you only change it here.

#### `components/Navbar/Navbar.js`
Fixed top bar with logo, search input, cart icon (with count badge), and category strip. The cart count comes from `useCart()`.

#### `pages/ProductListPage.js`
Reads URL search params (`?search=...&category=...`) and fetches matching products. Filters in the sidebar update URL params, which triggers a new fetch.

### Backend Modules

#### `main.py`
Starts the FastAPI server, sets up CORS (so React can call the API), and registers all routers.

#### `database/connection.py`
Creates the MySQL connection using SQLAlchemy. The `get_db()` function creates a fresh database session for each API request and closes it when done.

#### `models/models.py`
Python classes that map to database tables. SQLAlchemy uses these to generate SQL queries automatically.

#### `schemas/schemas.py`
Pydantic models that validate incoming data (request body) and format outgoing data (response). They're like contracts: "this endpoint expects THIS shape of data and returns THIS shape."

#### `routers/cart.py`
Handles all cart operations. Uses `user_id=1` as the default user (no login required for demo). When a product is added, it checks stock availability first.

#### `routers/orders.py`
Places orders by: (1) reading cart items, (2) calculating totals, (3) creating an Order record, (4) creating OrderItem records (snapshots), (5) reducing product stock, (6) clearing the cart.

---

## 🔧 Common Issues & Solutions

### ❌ "CORS error" in browser console
**Fix:** Make sure the backend is running on port 8000. The CORS config in `main.py` allows `localhost:3000`.

### ❌ "Connection refused" when loading products
**Fix:** The backend isn't running. Start it with `uvicorn main:app --reload`

### ❌ "Access denied for user 'root'" in backend logs
**Fix:** Your MySQL password in `.env` is wrong. Double-check it.

### ❌ Products not showing (empty grid)
**Fix:** Run the seed file: `mysql -u root -p flipkart_clone < backend/database/seed.sql`

### ❌ `npm install` fails
**Fix:** Make sure Node.js v18+ is installed: `node --version`

### ❌ "Module not found" in Python
**Fix:** Make sure your virtual environment is activated (you see `(venv)` in the terminal)

---


## 📦 Running Both Servers (Quick Reference)

**Terminal 1 — Backend:**
```bash
cd flipkart-clone/backend
source venv/bin/activate   # Mac/Linux
# or: venv\Scripts\activate  (Windows)
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd flipkart-clone/frontend
npm start
```

Then visit: **http://localhost:3000** 🎉
