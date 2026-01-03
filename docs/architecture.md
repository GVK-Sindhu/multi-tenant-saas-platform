# System Architecture Document

## 1. Overview

This document describes the overall system architecture of the **Multi-Tenant SaaS Project Management Platform**. The architecture is designed to ensure scalability, security, tenant data isolation, and ease of deployment using Docker.

The system follows a **client–server architecture** with a clear separation of concerns between frontend, backend, and database layers.

---

## 2. High-Level System Architecture

### 2.1 Architecture Description

The platform consists of the following main components:

1. **Client (Browser)**
   End users access the system through a web browser.

2. **Frontend Application**
   A React-based web application responsible for rendering UI, handling user interactions, and communicating with the backend API.

3. **Backend API Server**
   A Node.js + Express REST API that handles authentication, authorization, business logic, and tenant isolation.

4. **Database (PostgreSQL)**
   A relational database storing all persistent data such as users, tenants, projects, and tasks.

5. **Authentication Flow**
   JWT-based authentication is used to secure API access and enforce role-based authorization.

---

### 2.2 Request Flow

1. User accesses the frontend via browser.
2. Frontend sends API requests to backend over HTTP.
3. Backend authenticates the request using JWT.
4. Tenant context is resolved using tenant_id.
5. Database queries are executed with tenant isolation.
6. Response is returned to frontend.

---

### 2.3 Architecture Diagram

The high-level system architecture diagram is stored at:

```
docs/images/system-architecture.png
```

The diagram includes:

* Client (Browser)
* Frontend (React)
* Backend API (Node.js / Express)
* PostgreSQL Database
* Authentication & Authorization flow

---

## 3. Database Schema Design

### 3.1 Database Design Approach

The system uses a **Shared Database + Shared Schema** multi-tenancy approach. All tenants share the same database tables, and tenant isolation is enforced using a `tenant_id` column.

---

### 3.2 Core Entities

#### Tenants

* id (UUID)
* name
* subdomain
* status
* subscription_plan
* created_at

#### Users

* id (UUID)
* email
* password_hash
* role (super_admin, tenant_admin, user)
* tenant_id (nullable for super admin)
* created_at

#### Projects

* id (UUID)
* name
* description
* tenant_id
* created_at

#### Tasks

* id (UUID)
* title
* status
* priority
* project_id
* tenant_id
* assigned_user_id
* created_at

---

### 3.3 Relationships

* One Tenant → Many Users
* One Tenant → Many Projects
* One Project → Many Tasks
* One User → Many Assigned Tasks

Foreign keys and indexes are used on:

* tenant_id
* project_id
* assigned_user_id

---

### 3.4 Entity Relationship Diagram (ERD)

The ERD diagram is available at:

```
docs/images/database-erd.png
```

The diagram clearly highlights:

* All tables
* Primary keys
* Foreign key relationships
* tenant_id columns for isolation

---

## 4. API Architecture

The backend exposes RESTful APIs organized by modules. Authentication is required for most endpoints, and role-based access control is enforced.

---

### 4.1 Authentication APIs

| Method | Endpoint                  | Auth Required | Roles  |
| ------ | ------------------------- | ------------- | ------ |
| POST   | /api/auth/register-tenant | No            | Public |
| POST   | /api/auth/login           | No            | Public |
| GET    | /api/auth/me              | Yes           | All    |

---

### 4.2 Tenant APIs

| Method | Endpoint                | Auth Required | Roles       |
| ------ | ----------------------- | ------------- | ----------- |
| GET    | /api/tenants            | Yes           | Super Admin |
| GET    | /api/tenants/:id        | Yes           | Super Admin |
| PATCH  | /api/tenants/:id/status | Yes           | Super Admin |

---

### 4.3 User APIs

| Method | Endpoint                     | Auth Required | Roles        |
| ------ | ---------------------------- | ------------- | ------------ |
| GET    | /api/tenants/:tenantId/users | Yes           | Tenant Admin |
| POST   | /api/tenants/:tenantId/users | Yes           | Tenant Admin |
| PATCH  | /api/users/:id               | Yes           | Tenant Admin |
| DELETE | /api/users/:id               | Yes           | Tenant Admin |

---

### 4.4 Project APIs

| Method | Endpoint          | Auth Required | Roles              |
| ------ | ----------------- | ------------- | ------------------ |
| GET    | /api/projects     | Yes           | Tenant Admin, User |
| POST   | /api/projects     | Yes           | Tenant Admin       |
| PATCH  | /api/projects/:id | Yes           | Tenant Admin       |
| DELETE | /api/projects/:id | Yes           | Tenant Admin       |

---

### 4.5 Task APIs

| Method | Endpoint       | Auth Required | Roles              |
| ------ | -------------- | ------------- | ------------------ |
| GET    | /api/tasks     | Yes           | Tenant Admin, User |
| POST   | /api/tasks     | Yes           | Tenant Admin       |
| PATCH  | /api/tasks/:id | Yes           | Tenant Admin, User |
| DELETE | /api/tasks/:id | Yes           | Tenant Admin       |

---

### 4.6 System APIs

| Method | Endpoint    | Auth Required | Roles  |
| ------ | ----------- | ------------- | ------ |
| GET    | /api/health | No            | Public |

---

## 5. Tenant Isolation Strategy

* tenant_id is derived from authenticated user context
* Middleware injects tenant_id into request lifecycle
* Super admin bypasses tenant filtering when required
* No endpoint allows cross-tenant access

---

## 6. Conclusion

This architecture ensures a clean separation of concerns, strong tenant isolation, and production-ready deployment using Docker. The design aligns with all evaluation requirements and supports scalability a
