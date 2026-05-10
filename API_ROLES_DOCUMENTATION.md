# E-commerce Marketplace API - Role-Based Access Control (RBAC)

This document lists all endpoints categorized by who can access them.

**Base URL**: `http://localhost:3000/api`

---

## **1. Public Endpoints (Anyone)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Create a new account (default: customer) |
| `POST` | `/auth/login` | Login to get JWT token |
| `GET` | `/products` | List all products with variants |
| `GET` | `/products/:id` | Get details of a specific product |
| `GET` | `/categories` | List all product categories |
| `GET` | `/brands` | List all brands |
| `GET` | `/campaigns/active` | See active marketing campaigns |
| `GET` | `/campaigns/:slug` | Get products in a specific campaign |
| `GET` | `/reviews/product/:productId` | View product reviews |

---

## **2. Customer Endpoints (Logged-in User)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/wallet/me` | View personal wallet balance |
| `GET` | `/wallet/transactions` | View wallet history |
| `POST` | `/sellers/register` | Apply to become a seller |
| `POST` | `/sellers/:id/follow` | Follow a specific shop |
| `DELETE` | `/sellers/:id/follow` | Unfollow a shop |
| `POST` | `/products/:id/ask` | Ask a question about a product |
| `POST` | `/orders` | Place a new order |
| `GET` | `/orders/me` | View my order history |
| `POST` | `/payments/initialize` | Start payment for an order |
| `POST` | `/vouchers/validate` | Check if a promo code is valid |
| `POST` | `/reviews` | Submit a review for a purchased product |
| `POST` | `/returns` | Request a return for an order item |
| `GET` | `/notifications/me` | View system notifications |

---

## **3. Seller & Staff Endpoints (Shop Management)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/products/my-products` | See only products belonging to my shop |
| `POST` | `/products` | Add a new product with variants |
| `PUT` | `/products/:id` | Update product details or stock |
| `DELETE` | `/products/:id` | Remove a product from the shop |
| `POST` | `/products/questions/:questionId/answer` | Answer a customer question |
| `POST` | `/sellers/sub-users` | Add staff members (Manager, Support) |
| `GET` | `/sellers/my-staff` | List all employees of the shop |
| `GET` | `/orders/seller` | Manage orders placed at my shop |
| `POST` | `/shipments` | Create a shipment for an order |
| `PUT` | `/shipments/:id/status` | Update delivery tracking status |
| `GET` | `/settlements/me` | View shop earnings and payout status |

---

## **4. Admin Endpoints (Full Control)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/sellers` | View all seller applications |
| `PUT` | `/sellers/:id/approve` | Approve a shop to start selling |
| `PUT` | `/sellers/:id/reject` | Reject a shop application with reason |
| `POST` | `/categories` | Create new product categories |
| `POST` | `/brands` | Create/Verify brands |
| `POST` | `/campaigns` | Create marketing events (11.11, Flash Sale) |
| `POST` | `/campaigns/:id/products` | Link products to a campaign |
| `POST` | `/settlements` | Manually trigger a seller payout |
| `PUT` | `/returns/:id/process` | Final decision on return requests |
