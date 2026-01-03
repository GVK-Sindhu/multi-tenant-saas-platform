# API Documentation – Multi-Tenant SaaS Platform

## Overview

This document provides complete API documentation for the **Multi-Tenant SaaS Project Management Platform**. The APIs are RESTful, JSON-based, and secured using JWT authentication. Tenant data isolation is enforced using `tenant_id` derived from the authenticated user context.

**Base URL (Docker):**

```
http://localhost:5000/api
```

**Authentication:**

* JWT-based authentication
* Token must be sent in `Authorization` header as:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication APIs

### 1. Register Tenant

**POST** `/auth/register-tenant`

**Auth Required:** No

**Request Body:**

```json
{
  "companyName": "Demo Company",
  "subdomain": "demo",
  "adminEmail": "admin@demo.com",
  "adminName": "Demo Admin",
  "password": "Demo@123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Tenant registered successfully"
}
```

---

### 2. Login

**POST** `/auth/login`

**Auth Required:** No

**Request Body:**

```json
{
  "email": "admin@demo.com",
  "password": "Demo@123",
  "tenantSubdomain": "demo"
}
```

**Response:**

```json
{
  "success": true,
  "token": "<JWT_TOKEN>",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@demo.com",
      "role": "tenant_admin",
      "tenantId": "uuid"
    }
  }
}
```

---

### 3. Get Current User

**GET** `/auth/me`

**Auth Required:** Yes

**Response:**

```json
{
  "id": "uuid",
  "email": "user@demo.com",
  "role": "user",
  "tenantId": "uuid"
}
```

---

## Tenant APIs

### 4. Get All Tenants

**GET** `/tenants`

**Auth Required:** Yes
**Role:** Super Admin

---

### 5. Get Tenant By ID

**GET** `/tenants/:id`

**Auth Required:** Yes
**Role:** Super Admin

---

### 6. Update Tenant Status

**PATCH** `/tenants/:id/status`

**Auth Required:** Yes
**Role:** Super Admin

**Request Body:**

```json
{
  "status": "active"
}
```

---

## User APIs

### 7. Get Users (Tenant)

**GET** `/tenants/:tenantId/users`

**Auth Required:** Yes
**Role:** Tenant Admin

---

### 8. Create User

**POST** `/tenants/:tenantId/users`

**Auth Required:** Yes
**Role:** Tenant Admin

**Request Body:**

```json
{
  "email": "user1@demo.com",
  "password": "User@123",
  "role": "user"
}
```

---

### 9. Update User

**PATCH** `/users/:id`

**Auth Required:** Yes
**Role:** Tenant Admin

---

### 10. Delete User

**DELETE** `/users/:id`

**Auth Required:** Yes
**Role:** Tenant Admin

---

## Project APIs

### 11. Get Projects

**GET** `/projects`

**Auth Required:** Yes
**Role:** Tenant Admin, User

---

### 12. Create Project

**POST** `/projects`

**Auth Required:** Yes
**Role:** Tenant Admin

**Request Body:**

```json
{
  "name": "Project Alpha",
  "description": "First demo project"
}
```

---

### 13. Update Project

**PATCH** `/projects/:id`

**Auth Required:** Yes
**Role:** Tenant Admin

---

### 14. Delete Project

**DELETE** `/projects/:id`

**Auth Required:** Yes
**Role:** Tenant Admin

---

## Task APIs

### 15. Get Tasks

**GET** `/tasks`

**Auth Required:** Yes
**Role:** Tenant Admin, User

---

### 16. Create Task

**POST** `/tasks`

**Auth Required:** Yes
**Role:** Tenant Admin

**Request Body:**

```json
{
  "projectId": "uuid",
  "title": "Initial Task",
  "priority": "high"
}
```

---

### 17. Update Task

**PATCH** `/tasks/:id`

**Auth Required:** Yes
**Role:** Tenant Admin, User

---

### 18. Delete Task

**DELETE** `/tasks/:id`

**Auth Required:** Yes
**Role:** Tenant Admin

---

## System API

### 19. Health Check

**GET** `/health`

**Auth Required:** No

**Response:**

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## Notes

* All APIs return proper HTTP status codes
* Tenant isolation is enforced server-side
* Unauthorized access returns `403 Forbidden`
* Invalid input returns `400 Bad Request`

---

## Conclusion

This API documentation covers all required endpoints for authentication, tenant management, user management, project handling, task tracking, and system health. It is designed to support both automated evaluation and human review.
