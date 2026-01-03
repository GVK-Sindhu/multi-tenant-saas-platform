# Technical Specification Document

## 1. Overview

This document provides technical details about the development, project structure, environment configuration, and setup process for the **Multi-Tenant SaaS Project Management Platform**. It is intended to help developers, evaluators, and reviewers understand how the system is organized and how it can be run locally or using Docker.

---

## 2. Technology Stack

### Backend

* Runtime: Node.js (v18+)
* Framework: Express.js
* Database: PostgreSQL 15
* Authentication: JWT (JSON Web Tokens)
* Password Hashing: bcrypt

### Frontend

* Framework: React.js
* HTTP Client: Axios
* Routing: React Router

### DevOps & Tooling

* Containerization: Docker
* Orchestration: Docker Compose
* Version Control: Git & GitHub

---

## 3. Project Structure

### 3.1 Backend Structure

```
backend/
├── src/
│   ├── controllers/     # API request handlers
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth, role, tenant isolation middleware
│   ├── models/          # Database query logic
│   ├── services/        # Business logic layer
│   ├── utils/           # Helper utilities
│   ├── config/          # Database & app configuration
│   └── server.js        # Application entry point
├── migrations/          # Database migration files
├── seeds/               # Seed data scripts
├── Dockerfile           # Backend Docker configuration
├── package.json
└── .env                 # Environment variables (committed for evaluation)
```

**Purpose:**

* Controllers handle HTTP logic
* Services contain business rules
* Middleware enforces security and tenant isolation
* Migrations and seeds initialize database automatically

---

### 3.2 Frontend Structure

```
frontend/
├── src/
│   ├── pages/           # Page-level components (Login, Dashboard, etc.)
│   ├── components/      # Reusable UI components
│   ├── api/             # Axios configuration and API calls
│   ├── context/         # Authentication and global state
│   ├── routes/          # Protected and public routes
│   ├── utils/           # Helper functions
│   ├── App.jsx
│   └── main.jsx
├── public/
├── Dockerfile           # Frontend Docker configuration
├── package.json
└── vite.config.js / webpack.config.js
```

**Purpose:**

* Pages represent main UI screens
* API layer centralizes backend communication
* Context manages authentication state

---

## 4. Environment Variables

### 4.1 Backend Environment Variables

The following environment variables are required for the backend:

```
DB_HOST=database
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRES_IN=24h

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://frontend:3000
```

An `.env.example` file is provided as a template. For evaluation, the `.env` file is committed with test values.

---

### 4.2 Frontend Environment Variables

```
REACT_APP_API_URL=http://backend:5000/api
```

These variables allow the frontend to communicate with the backend within the Docker network.

---

## 5. Development Setup Guide

### 5.1 Prerequisites

* Node.js v18 or higher
* Docker & Docker Compose
* Git

---

### 5.2 Local Development (Without Docker)

1. Clone the repository
2. Install backend dependencies

   ```
   cd backend
   npm install
   ```
3. Configure `.env` file
4. Run database migrations and seeds
5. Start backend server

   ```
   npm run dev
   ```
6. Start frontend

   ```
   cd frontend
   npm install
   npm run dev
   ```

---

### 5.3 Docker-Based Setup (Recommended)

1. Ensure Docker is running
2. From project root, run:

```
docker-compose up -d
```

3. Verify services:

* Backend: [http://localhost:5000/api/health](http://localhost:5000/api/health)
* Frontend: [http://localhost:3000](http://localhost:3000)

All services (database, backend, frontend) start automatically, including migrations and seed data.

---

## 6. Database Initialization

* Database migrations run automatically on backend startup
* Seed data is inserted automatically after migrations
* No manual commands are required

This ensures compatibility with automated evaluation scripts.

---

## 7. Testing & Verification

* Health check endpoint: `GET /api/health`
* Authentication testing using credentials from `submission.json`
* Tenant isolation tested via role-based access

---

## 8. Security & Best Practices

* Passwords hashed using bcrypt
* JWT secrets stored in environment variables
* CORS configured using FRONTEND_URL
* Tenant isolation enforced in middleware

---

## 9. Conclusion

This technical specification outlines a clear, maintainable, and evaluation-ready setup for the multi-tenant SaaS platform. The structure and setup ensure ease of development, testing, and deployment using Docker.
