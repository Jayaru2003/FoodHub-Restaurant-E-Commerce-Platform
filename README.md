# FoodHub - Restaurant & Food Ordering E-Commerce Platform

FoodHub is a modern, full-stack responsive E-Commerce application built for restaurants and food ordering businesses. It features a customer-facing store for menu browsing, cart management, and multi-option checkout, along with a comprehensive Admin Panel for catalog, inventory, and order management.

- **Live Application URL:** `https://food-hub-restaurant-e-commerce-plat.vercel.apphttps://food-hub-restaurant-e-commerce-plat.vercel.app`
---

> [!IMPORTANT]
> **Default Admin Account Credentials (for testing):**
> - **Email:** `admin@gmail.com`
> - **Password:** `admin123`

---

## 🌟 Key Features

### 🛒 Customer-Facing Store
- **Interactive Food Catalog:** Browse food items by categories (Burgers, Pizza, Pasta, Desserts, Beverages, etc.) with real-time text search and availability filters.
- **Product Details:** Detailed view of menu items, prices, stock availability, and image gallery.
- **Cart Management:** Dynamic shopping cart with quantity updates, item removal, and subtotal calculation stored in local session.
- **Delivery Information:** Saved customer address selection or inline creation of new delivery addresses with Sri Lankan phone number format validation.
- **Dual Checkout Options:**
  - 💳 **PayHere Online Payment (Sandbox):** Seamless form-based integration redirecting customers to the PayHere Sandbox test portal with order ID, LKR currency, customer info, and callback/notification handler setup.
  - 📱 **Order via WhatsApp:** Generates a structured, pre-filled WhatsApp message containing the complete cart item list (`Item x Qty`), customer details, delivery address, and total amount sent directly to the restaurant's WhatsApp business number.

### 🛡️ Admin Panel (`/admin`)
- **Protected Admin Routes:** Role-based access control (`ROLE_ADMIN`) protecting administrative features.
- **Dashboard Overview:** Real-time statistics including total sales revenue, total orders count, pending orders, and registered catalog products count.
- **Catalog Management:** Create, edit, update, or soft-delete food categories and menu items.
- **Inventory & Stock Tracking:** Real-time stock quantity management and instant toggle for product availability (`Is Available`).
- **Order Lifecycle Management:** View incoming orders, filter by status, inspect item breakdowns and delivery details, and transition order states:
  `PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` (or `CANCELLED`).
- **Payment Reconciliation:** Inspect payment statuses (`PENDING`, `PAID`, `FAILED`) and update payment records.

---

## 🏗️ Technical Architecture & Tech Stack

### Tech Stack
- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Lucide React / Custom UI components.
- **Backend:** Java 17 / 21, Spring Boot `3.3.5`, Spring Security, Spring Data JPA, Hibernate, Jakarta Bean Validation.
- **Database:** PostgreSQL (Production / Local) & H2 (In-Memory for unit testing).
- **Authentication:** JSON Web Tokens (JWT) with BCrypt password hashing.
- **Build Tools:** Maven for backend, npm / Vite for frontend.

### Architecture Diagram
```text
┌─────────────────────────────────────────────────────────┐
│              Client Browser (React 18 + Vite)           │
│   ├── Customer Store (Catalog, Cart, PayHere / WhatsApp)│
│   └── Admin Panel (Dashboard, Products, Orders)         │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP / JSON REST APIs (JWT Bearer Auth)
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Spring Boot 3 Backend Service             │
│   ├── Controllers (Auth, Product, Category, Order, etc.)│
│   ├── Security & JwtAuthenticationFilter                │
│   ├── Services & Repositories (Spring Data JPA)         │
│   └── Global Exception Handler & Bean Validation        │
└────────────────────────────┬────────────────────────────┘
                             │ JDBC
                             ▼
┌─────────────────────────────────────────────────────────┐
│                PostgreSQL Database                      │
│   (Users, Addresses, Categories, Products, Orders)      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 Authentication & Security

1. **Password Security:** All passwords are hashed using BCrypt before persistence in the `users` table. Plaintext passwords are never stored or logged.
2. **Stateless JWT Authorization:** API endpoints are secured via bearer tokens issued upon `POST /api/auth/login`. The token encodes the user identity and authority (`ROLE_CUSTOMER` / `ROLE_ADMIN`).
3. **Role-Based Endpoint Protection:** Sensitive backend APIs (such as `/api/admin/**` and product mutation routes) are strictly gated with `@PreAuthorize("hasRole('ADMIN')")`.
4. **Input Validation:** Incoming request bodies are validated using Jakarta annotations (`@NotNull`, `@NotBlank`, `@Min`, `@Email`). Invalid payloads trigger structured error responses via `GlobalExceptionHandler`.
5. **Environment Variable Isolation:** Database passwords, JWT secret keys (`JWT_SECRET`), and PayHere merchant configuration are injected via `.env` files and environment variables.

---

## 🗄️ Database Design

| Table Name | Description | Key Relationships & Constraints |
| --- | --- | --- |
| `users` | Store customer & staff accounts | Unique `email`, `role` (`CUSTOMER` / `ADMIN`), BCrypt `password_hash` |
| `addresses` | Customer delivery addresses | Belongs to `user` (`user_id` FK) |
| `categories` | Food categories (e.g., Pizza, Beverages) | Unique `name` |
| `products` | Menu items, pricing & stock | Belongs to `category` (`category_id` FK), non-negative price & stock |
| `orders` | Transactional order header | Belongs to `user` & `address`, snapshot of customer name/phone, order status & payment status |
| `order_items` | Individual line items purchased | Belongs to `order` & `product`, locks unit price & subtotal at purchase time |

---

## 🚀 Setup and Local Development Instructions

### Prerequisites
- **JDK 17** or **JDK 21**
- **Node.js 18+** and **npm**
- **Maven 3.8+**
- **PostgreSQL 14+** (or local PostgreSQL server)

---

### Step 1: Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a local PostgreSQL database named `foodhub`:
   ```sql
   CREATE DATABASE foodhub;
   ```

3. Copy `.env.example` to `.env` in the `backend/` directory:
   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/foodhub
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   JWT_EXPIRATION_MS=86400000
   ADMIN_EMAIL=admin@gmail.com
   ADMIN_PASSWORD=admin123
   ADMIN_NAME=Restaurant Admin
   ```

4. Build and run the Spring Boot server:
   ```bash
   mvn clean package
   mvn spring-boot:run
   ```
   The backend API will run on `http://localhost:8080`.

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The customer store and admin panel will be accessible at `http://localhost:5173`.

---

## 🧪 Testing and Verification

### Backend Automated Tests
Run the Spring Boot unit and integration tests (which execute against an in-memory H2 database):
```bash
cd backend
mvn test
```
- **Test Status:** 12 / 12 Tests Passing (CategoryControllerTest, ProductControllerTest, etc.)

### Frontend Production Build Verification
Verify that the React frontend builds without compilation errors:
```bash
cd frontend
npm run build
```
- **Build Status:** Clean production build (`dist/` directory generated successfully).

---

## 📋 Technical Requirements Checklist (dartcodes Technical Assessment)

| Assessment Requirement | Status | Implementation Details |
| --- | --- | --- |
| **Business Scenario (Restaurant & Food)** | ✅ Completed | Fully customized food ordering platform with categories, meals, beverages, and realistic restaurant workflow. |
| **Customer Store (Browsing, Cart, Checkout)** | ✅ Completed | Responsive UI, product details, cart state, customer contact & delivery address collection. |
| **Admin Panel** | ✅ Completed | Dashboard stats, catalog CRUD (categories & products), inventory stock toggles, and order status workflow. |
| **PayHere Online Payment (Sandbox)** | ✅ Completed | Form-based integration configured for `https://sandbox.payhere.lk/pay/checkout` with merchant params & notify callback handler. |
| **Order via WhatsApp** | ✅ Completed | Formats shopping cart into a clean pre-filled WhatsApp message URL (`wa.me`) with line items, quantities, customer details & total amount. |
| **Backend & Persistent Database** | ✅ Completed | Spring Boot REST APIs with PostgreSQL persistence and JPA relationships. |
| **Authentication & Security** | ✅ Completed | BCrypt password hashing, stateless JWT authentication, and `@PreAuthorize` role protection. |
| **Validation & Error Handling** | ✅ Completed | Spring Bean Validation on DTOs, global exception handler, frontend field validation. |
| **Responsive Design** | ✅ Completed | Tailored mobile-friendly layout built with Tailwind CSS. |

---



