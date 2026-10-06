# FoodHub Restaurant E-Commerce Platform

FoodHub is a restaurant ordering platform intended to support product browsing, customer accounts, delivery addresses, order management, inventory tracking, and restaurant administration. The repository currently contains the Spring Boot backend domain model and PostgreSQL configuration. The frontend source and API/controller layers are not yet included in this checkout, so the implementation status is documented explicitly below.

> [!IMPORTANT]
> **Admin account:** `admin@gmail.com`
>
> **Admin account password:** `admin123`

## Technologies

### Backend

- Java with Spring Boot `3.3.5`
- Spring Data JPA and Hibernate for persistence
- Jakarta Bean Validation for entity input constraints
- Jackson for JSON serialization
- PostgreSQL as the runtime database
- Maven for dependency management and builds

### Frontend

The `frontend/` directory is reserved for the web client, but it currently contains no source files or `package.json`. The frontend stack, build commands, and API client configuration should be added here when the client is introduced. Generated or locally installed frontend artifacts (`dist/`, `.vite/`, and `node_modules/`) are not a substitute for frontend source code.

## Repository structure

```text
.
├── backend/
│   ├── pom.xml
│   ├── .env.example
│   └── src/
│       └── main/
│           ├── java/com/foodhub/
│           │   ├── FoodHubApplication.java
│           │   └── entity/
│           └── resources/application.properties
├── frontend/
│   └── .gitkeep
└── README.md
```

The backend currently consists primarily of the persistence model. Controllers, services, repositories, authentication configuration, and payment callbacks should be added before treating the application as production-ready.

## Setup and local development

### Prerequisites

- JDK 17 or newer compatible with Spring Boot 3
- Maven 3.8+
- PostgreSQL 14+ (or another version supported by the selected PostgreSQL JDBC driver)
- Git

### 1. Create the database

Create a local PostgreSQL database:

```sql
CREATE DATABASE foodhub;
```

The schema is created or updated by Hibernate when the application starts. For production, replace this with versioned migrations such as Flyway or Liquibase.

### 2. Configure backend environment variables

Copy [`backend/.env.example`](backend/.env.example) to `backend/.env` and replace the placeholder password:

```properties
DB_URL=jdbc:postgresql://localhost:5432/foodhub
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
```

Do not commit `.env` or real credentials. The backend imports this file through `spring.config.import=optional:file:.env[.properties]`.

### 3. Build and run the backend

From the repository root:

```powershell
cd backend
mvn clean package
mvn spring-boot:run
```

The application uses Spring Boot's default port, `http://localhost:8080`, unless a server port is configured later.

### 4. Frontend setup

There is currently no runnable frontend in the repository. When frontend source is added, document its package manager, required Node.js version, environment variables, development command, and production build command in this section.

## Architecture

FoodHub is designed as a two-tier web application:

```text
Customer/Admin browser
        │
        │ JSON/HTTP API (to be implemented)
        ▼
Spring Boot application
  ├── Controllers      (not currently present)
  ├── Services         (not currently present)
  ├── Repositories     (not currently present)
  └── JPA entities
        │
        ▼
PostgreSQL
```

The entity model separates customer identity, delivery data, catalog data, and transactional order data. `OrderItem` stores the unit price and subtotal at the time of purchase so historical orders do not depend on later product price changes.

## Database design

Hibernate maps the following entities to PostgreSQL tables:

| Table | Purpose | Key relationships |
| --- | --- | --- |
| `users` | Customer and administrator accounts | One user has many addresses and orders |
| `addresses` | Saved delivery addresses | Each address belongs to one user |
| `categories` | Product grouping and category metadata | One category has many products |
| `products` | Menu items, prices, images, availability, and stock | Each product belongs to one category |
| `orders` | Order header, customer snapshot, totals, payment state, and delivery state | Each order belongs to one user and address |
| `order_items` | Products and quantities purchased in an order | Each item belongs to one order and product |

Important constraints include:

- Unique customer email addresses and category names.
- Non-negative product stock, prices, totals, and delivery fees.
- Positive order-item quantities.
- Required foreign keys from orders to users/addresses and from order items to orders/products.
- UTC-oriented timestamp configuration for consistent order history.

## Customer functionality

The domain model supports the following customer-facing concepts:

- Customer accounts with contact information and a default `CUSTOMER` role.
- Multiple saved delivery addresses.
- Product categories and menu items with availability and stock quantity.
- Orders containing multiple items, delivery fees, notes, and customer contact snapshots.
- Order statuses: `PENDING`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, and `CANCELLED`.
- Payment methods represented by `PAYHERE` and `WHATSAPP`.
- Payment statuses: `PENDING`, `PAID`, and `FAILED`.

The HTTP endpoints and user interface for these capabilities are not included yet; the entities define the persistence contract that those layers should use.

## Admin details

### Admin role

The `users.role` field uses the `Role` enum:

- `CUSTOMER` — regular ordering account and the default role.
- `ADMIN` — restaurant staff account intended to manage operational data.

### Expected admin responsibilities

An admin dashboard should provide authenticated staff with:

1. **Catalog management** — create, edit, and deactivate categories and products.
2. **Inventory management** — update stock quantities and availability, and prevent ordering unavailable items.
3. **Order operations** — review orders and move them through the allowed order-status workflow.
4. **Payment review** — inspect payment state and reconcile failed or pending payments.
5. **Customer/order support** — view customer contact and delivery information needed to fulfil an order.

### Current admin implementation status

The `ADMIN` role and authentication implementation are present. The following administrative features are available in the backend:

- JWT login through `POST /api/auth/login`.
- BCrypt password hashing through Spring Security's `PasswordEncoder`.
- Stateless bearer-token authentication through `JwtAuthenticationFilter`.
- Role-based route protection through `SecurityConfig` and `@EnableMethodSecurity`.
- Startup provisioning of an administrator through `AdminAccountInitializer`.

### Admin authentication flow

1. Configure the administrator's email, password, and display name through `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME`.
2. On application startup, `AdminAccountInitializer` normalizes the email, BCrypt-hashes the configured password, and creates or updates the account with the `ADMIN` role.
3. Submit the admin credentials to `POST /api/auth/login`:

   ```json
   {
     "email": "admin@gmail.com",
     "password": "admin123"
   }
   ```

4. The response contains the user profile, role, and a signed JWT. Send that token on protected requests:

   ```http
   Authorization: Bearer <admin-jwt-token>
   ```

5. The JWT contains the user's email as its subject, plus `userId`, `role`, issue time, and expiration. The configured lifetime is controlled by `JWT_EXPIRATION_MS` and defaults to one hour.

Invalid credentials return an authentication error without revealing whether the email or password was incorrect. Missing or invalid bearer tokens receive `401 Unauthorized`; authenticated users without the required role receive `403 Forbidden`.

### Admin authorization

The current security rules allow:

- Public access to registration, login, and read-only product/category endpoints.
- `CUSTOMER` or `ADMIN` access to creating and reading orders.
- `ADMIN` access to product/category creation, updates, and deletion.
- `ADMIN` access to `GET` and `PATCH` endpoints under `/api/admin/**`.
- Authentication for all other endpoints by default.

The frontend must not treat a user's returned `role` value as sufficient authorization. The backend remains the source of truth and checks the signed token and current user authorities on every protected request.

### Admin credential requirements

The repository does not provide a safe universal admin password. Set a unique, high-entropy `ADMIN_PASSWORD` outside source control. The startup initializer updates the stored hash from the configured password on every application start, so changing `ADMIN_PASSWORD` changes the admin credential at the next restart. Store database credentials, `JWT_SECRET`, and admin credentials in a secret manager or an untracked environment file.

For production, replace startup password provisioning with a controlled first-admin bootstrap or migration, enforce a password change on first login, add password reset and account lockout/recovery flows, and record administrative actions in an audit log.

## Important technical decisions

- **Spring Boot 3** provides the application runtime and uses Jakarta APIs.
- **JPA entities** keep the initial model close to the relational schema and allow the API/service layers to evolve independently.
- **PostgreSQL** is used for relational integrity, monetary precision, and transactional order data.
- **`BigDecimal`** is used for prices, totals, delivery fees, and subtotals to avoid floating-point currency errors.
- **Enum strings** are persisted for roles, payment methods, payment statuses, and order statuses so database values remain readable.
- **`ddl-auto=update`** is convenient for local development, but should be replaced with reviewed migrations before deployment.
- **UTC timestamps** reduce ambiguity across customer, restaurant, and delivery time zones.

## Security approach

The current implementation includes validation annotations, unique email constraints, bounded field lengths, a dedicated `password_hash` column, BCrypt password hashing, stateless JWT authentication, CORS configuration, and role-based Spring Security authorization.

Before deployment, the application should also:

- Hash passwords with a modern adaptive algorithm such as BCrypt or Argon2; never store plaintext passwords.
- Replace the development JWT fallback secret with a randomly generated secret of at least 32 characters and use a secure key-management process.
- Add refresh-token rotation or another controlled token renewal strategy if sessions longer than the JWT lifetime are required.
- Restrict all catalog mutation, inventory, payment reconciliation, role-management, and order-transition operations to `ADMIN` users.
- Validate ownership before allowing a customer to access addresses or orders.
- Validate request DTOs rather than exposing entities directly from public endpoints.
- Recalculate prices and totals on the server from trusted product data.
- Verify PayHere callback signatures and make payment callbacks idempotent before marking an order as paid.
- Keep secrets in environment variables or a secret manager and use HTTPS in deployed environments.
- Add audit logs, rate limiting, security headers, CORS policy, and dependency/CVE scanning.

## Assumptions and limitations

- The application assumes PostgreSQL is available and that the configured database user can create or update tables during local development.
- The current Hibernate setting may change an existing schema automatically; do not use it as the production migration strategy.
- PayHere and WhatsApp are represented as enum values only. Payment API integration, callback verification, WhatsApp message generation, and delivery confirmation are not implemented in this checkout.
- The frontend and admin dashboard are not included in this checkout, although the backend authentication and authorization layers are present.
- The admin account is provisioned from environment-backed configuration at startup; no credentials should be committed or shared in documentation.
- Product images currently use URL fields; file storage, validation, CDN delivery, and image moderation are outside the current scope.
- No explicit API versioning, observability, backup/restore process, or deployment configuration is currently documented in code.

## Testing

Run the backend build and tests with:

```powershell
cd backend
mvn test
```

Add controller, service, repository, authorization, payment-callback, and end-to-end tests as those layers are implemented.
