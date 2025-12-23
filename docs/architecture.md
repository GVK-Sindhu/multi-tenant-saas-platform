# System Architecture

---

## 1. High-Level Architecture

Components:
- Browser (Client)
- React Frontend
- Node.js Backend (API)
- PostgreSQL Database

Authentication Flow:
1. User logs in
2. JWT issued
3. JWT used for all protected requests

---

## 2. Database Design

Core Tables:
- tenants
- users
- projects
- tasks
- audit_logs

Each tenant-specific table includes `tenant_id`.

---

## 3. API Architecture

Modules:
- Auth
- Tenants
- Users
- Projects
- Tasks

All APIs enforce RBAC and tenant isolation.
