# Research & System Design – Multi-Tenant SaaS Platform

## 1. Multi-Tenancy Analysis

Multi-tenancy is a software architecture where a single instance of an application serves multiple tenants (organizations), while ensuring data isolation, security, and performance fairness. In a SaaS system, choosing the correct multi-tenancy strategy is critical because it directly affects scalability, cost, security, and maintenance.

This project evaluates three common multi-tenancy approaches and justifies the chosen strategy.

---

### 1.1 Shared Database + Shared Schema (Tenant ID Column)

**Description:**
In this approach, all tenants share the same database and the same set of tables. Each table contains a `tenant_id` column that identifies which tenant owns a particular record. Every query must filter by `tenant_id` to ensure isolation.

**Example:**

* users(id, email, password, role, tenant_id)
* projects(id, name, tenant_id)

**Advantages:**

* Lowest infrastructure cost (single database)
* Simple deployment and scaling
* Easy to add new tenants
* Works well with ORMs and migrations

**Disadvantages:**

* High risk if tenant filtering is missed in queries
* Complex authorization logic required
* Harder to provide tenant-specific customizations
* Compliance concerns for strict data isolation regulations

**Use Cases:**

* Early-stage SaaS products
* Cost-sensitive applications
* Moderate security requirements

---

### 1.2 Shared Database + Separate Schema (Per Tenant)

**Description:**
In this approach, a single database is used, but each tenant has its own schema. Tables are duplicated per tenant schema, such as `tenant1.users`, `tenant2.users`, etc.

**Advantages:**

* Stronger data isolation than shared schema
* Easier tenant-level backups and restores
* Reduced risk of cross-tenant data leaks

**Disadvantages:**

* Schema management complexity
* Harder to run global migrations
* Increased operational overhead
* Limited scalability when tenants grow large

**Use Cases:**

* Medium-sized SaaS products
* Systems requiring stronger isolation without full database separation

---

### 1.3 Separate Database per Tenant

**Description:**
Each tenant gets its own dedicated database. The application connects to different databases based on tenant context.

**Advantages:**

* Maximum data isolation
* Strong security and compliance
* Easy tenant-level performance tuning
* Independent backup and restore

**Disadvantages:**

* High infrastructure cost
* Complex connection management
* Difficult to scale for many tenants
* Operationally heavy

**Use Cases:**

* Enterprise SaaS
* Highly regulated industries (finance, healthcare)

---

### 1.4 Comparison Table

| Approach                    | Cost   | Isolation | Scalability | Complexity |
| --------------------------- | ------ | --------- | ----------- | ---------- |
| Shared DB + Shared Schema   | Low    | Medium    | High        | Low        |
| Shared DB + Separate Schema | Medium | High      | Medium      | Medium     |
| Separate Database           | High   | Very High | Low         | High       |

---

### 1.5 Chosen Approach & Justification

This project uses **Shared Database + Shared Schema with tenant_id**.

**Reasons for selection:**

* Suitable for a demo and evaluation-focused SaaS platform
* Simplifies Docker-based deployment
* Easier migrations and seed data handling
* Aligns well with PostgreSQL and Node.js ORM patterns
* Efficient for automated testing and evaluation scripts

Data isolation is enforced strictly through middleware that injects `tenant_id` into all queries, ensuring no cross-tenant access.

---

## 2. Technology Stack Justification

### 2.1 Backend Framework – Node.js with Express.js

**Why chosen:**

* Lightweight and fast
* Excellent ecosystem for REST APIs
* Easy integration with PostgreSQL
* Large community support

**Alternatives considered:**

* Django (Python)
* Spring Boot (Java)

Express was chosen for its simplicity and flexibility.

---

### 2.2 Frontend Framework – React.js

**Why chosen:**

* Component-based architecture
* Strong ecosystem
* Easy role-based UI rendering
* Works well with REST APIs

**Alternatives considered:**

* Angular
* Vue.js

---

### 2.3 Database – PostgreSQL

**Why chosen:**

* Strong relational support
* ACID compliance
* JSON support
* Mature and production-ready

**Alternatives considered:**

* MySQL
* MongoDB

---

### 2.4 Authentication – JWT (JSON Web Tokens)

**Why chosen:**

* Stateless authentication
* Works well with REST APIs
* Easy role and tenant encoding

**Alternatives considered:**

* Session-based auth
* OAuth (not required for scope)

---

### 2.5 Containerization – Docker & Docker Compose

**Why chosen:**

* Consistent environments
* Easy evaluation
* Automatic startup of services
* Simplifies dependency management

---

## 3. Security Considerations

### 3.1 Data Isolation Strategy

* `tenant_id` enforced at middleware level
* No API allows cross-tenant access
* Super admin explicitly handled

### 3.2 Authentication & Authorization

* JWT-based authentication
* Role-based access control (RBAC)
* Middleware enforces role checks

### 3.3 Password Hashing

* Passwords hashed using bcrypt
* No plain-text storage
* Salted hashes

### 3.4 API Security Measures

* Input validation
* Proper HTTP status codes
* Centralized error handling
* SQL injection prevention via parameterized queries

### 3.5 Additional Security Measures

* CORS configuration
* Environment-based configuration
* Non-root Docker containers (where applicable)

---

## Conclusion

This research establishes a solid foundation for building a secure, scalable, and evaluation-ready multi-tenant SaaS platform. The chosen architecture balances simplicity, security, and performance while meeting all project requirements.
