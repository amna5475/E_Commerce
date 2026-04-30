# E-Commerce Marketplace API 

A robust, production-ready Multi-vendor E-commerce Backend API built with Node.js, Express, and Sequelize (PostgreSQL). This project implements advanced features similar to major marketplaces like Daraz.

## 🚀 Key Features

- **Multi-vendor Architecture**: Comprehensive seller onboarding, shop management, and staff (sub-user) management via junction tables.
- **Advanced Product Management**: Categories, brands, variants (color, size, material), and dynamic product attributes.
- **Marketing & Campaigns**: Time-bound marketing campaigns with discount overrides for specific products.
- **Financial System**: Integrated user wallets for faster checkouts and easy refunds, transaction history, and seller settlements.
- **Customer Engagement**: Product Q&A (Ask a Question), shop following system, and verified purchase reviews.
- **Order Lifecycle**: Automated inventory tracking, multi-step order processing, shipment event logging, and return management.
- **Security & Audit**: JWT-based Role-Based Access Control (RBAC) and administrative activity logging.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger UI

## 📂 Project Structure

- `controllers/`: Request handling and response formatting.
- `services/`: Core business logic and database interactions.
- `models/`: Database schema definitions and relationships ([dbModel.js](models/dbModel.js)).
- `middleware/`: Authentication, authorization, and validation logic.
- `routes/`: API endpoint definitions ([ApiRoutes.js](routes/ApiRoutes.js)).
- `adapters/`: External service integrations (Uploads, Errors).

## ⚙️ Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file based on the project requirements (DB credentials, JWT secret).
4. **Run the application**
   ```bash
   npm start
   ```

## 📜 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:3000/api-docs` (Default port)

## 🤝 Contributing

This project is built for real-world use cases. Feel free to explore the code and implement new features.
