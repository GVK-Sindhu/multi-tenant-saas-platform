# Research Document  
## Multi-Tenant SaaS Platform – Project & Task Management System

---

## 1. Multi-Tenancy Analysis

Multi-tenancy is an architectural pattern where a single application instance serves multiple organizations (tenants) while ensuring strict data isolation, security, and performance. Choosing the correct multi-tenancy approach is critical for SaaS scalability and maintainability.

### 1.1 Multi-Tenancy Approaches Comparison

| Approach | Description | Pros | Cons |
|--------|-------------|------|------|
| Shared Database + Shared Schema | All tenants share the same database and tables, differentiated using a `tenant_id` column | Cost-efficient, easy to scale, simple deployment | Requires strict tenant filtering, higher risk if misconfigured |
| Shared Database + Separate Schema | One database with separate schema per tenant | Better isolation than shared schema | Schema migrations become complex |
| Separate Database per Tenant | Each tenant has its own database | Maximum isolation and security | High cost, operational complexity |

### 1.2 Chosen Approach

This project uses **Shared Database + Shared Schema with tenant_id**.

#### Justification
- Best balance between scalability and cost
- Easier to manage in Dockerized environments
- Suitable for small to medium SaaS customers
- Meets evaluation requirement for tenant isolation

#### Data Isolation Strategy
- Every tenant-specific table includes `tenant_id`
- `tenant_id` is extracted from JWT, never from client input
- Super admin users have `tenant_id = NULL`
- Queries are filtered automatically at API level

---

## 2. Technology Stack Justification

### Backend – Node.js with Express.js
Chosen for its lightweight nature, strong middleware ecosystem, easy JWT integration, and excellent Docker support.

**Alternatives considered:** Django, Spring Boot

### Frontend – React.js
Provides component-based UI, easy protected routes, and strong ecosystem.

**Alternatives considered:** Angular, Vue.js

### Database – PostgreSQL
Chosen for strong relational constraints, ACID compliance, UUID support, and performance.

**Alternatives considered:** MySQL, MongoDB

### Authentication – JWT
Stateless, scalable, suitable for microservices, no session storage required.

### Deployment – Docker & Docker Compose
Ensures consistent environments and one-command deployment, mandatory for evaluation.

---

## 3. Security Considerations

### Key Security Measures
1. Tenant data isolation via `tenant_id`
2. JWT authentication with expiry
3. Role-Based Access Control (RBAC)
4. Password hashing using bcrypt
5. Audit logging for all critical actions

### Password Security
- Passwords are hashed using bcrypt with salt
- Plain text passwords are never stored

### API Security
- Input validation
- Centralized error handling
- Proper HTTP status codes
- Restricted CORS configuration
- No sensitive data in API responses

---

## Conclusion
This architecture ensures scalability, security, and maintainability while meeting all functional and non-functional requirements of a multi-tenant SaaS platform.
