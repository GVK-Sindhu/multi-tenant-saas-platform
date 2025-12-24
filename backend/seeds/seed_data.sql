-- SUPER ADMIN (tenant_id = NULL)
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    NULL,
    'superadmin@system.com',
    '$2b$10$V9V5XbJvV8Jv3QjELrJH2u8s5l7S6b1kz5m5K5h8zJfXg9Eo3Ywxy', -- Admin@123
    'System Super Admin',
    'super_admin'
);

-- DEMO TENANT
INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects)
VALUES (
    gen_random_uuid(),
    'Demo Company',
    'demo',
    'active',
    'pro',
    25,
    15
);

-- TENANT ADMIN
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT
    gen_random_uuid(),
    t.id,
    'admin@demo.com',
    '$2b$10$0MZ1QZL8D1A0lP4i8sFZKONj.fZ1Qxyy9VZ8kQ3PjR7N2N1R6zGZy', -- Demo@123
    'Demo Admin',
    'tenant_admin'
FROM tenants t WHERE t.subdomain = 'demo';

-- REGULAR USERS
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT gen_random_uuid(), t.id, 'user1@demo.com',
'$2b$10$Y2A8Uo8j4l3FJmQjKkE6tOe5tZP5xY6wL7yF2mXU3vXn9m2x8w2Wy',
'Demo User One', 'user'
FROM tenants t WHERE t.subdomain = 'demo';

INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT gen_random_uuid(), t.id, 'user2@demo.com',
'$2b$10$Y2A8Uo8j4l3FJmQjKkE6tOe5tZP5xY6wL7yF2mXU3vXn9m2x8w2Wy',
'Demo User Two', 'user'
FROM tenants t WHERE t.subdomain = 'demo';

-- PROJECTS
INSERT INTO projects (id, tenant_id, name, description, created_by)
SELECT gen_random_uuid(), t.id, 'Project Alpha', 'First demo project', u.id
FROM tenants t, users u
WHERE t.subdomain = 'demo' AND u.role = 'tenant_admin';

INSERT INTO projects (id, tenant_id, name, description, created_by)
SELECT gen_random_uuid(), t.id, 'Project Beta', 'Second demo project', u.id
FROM tenants t, users u
WHERE t.subdomain = 'demo' AND u.role = 'tenant_admin';

-- TASKS
INSERT INTO tasks (id, project_id, tenant_id, title, status, priority)
SELECT gen_random_uuid(), p.id, p.tenant_id, 'Initial Setup', 'todo', 'high'
FROM projects p LIMIT 1;

INSERT INTO tasks (id, project_id, tenant_id, title)
SELECT gen_random_uuid(), p.id, p.tenant_id, 'Design Database Schema'
FROM projects p LIMIT 1;

INSERT INTO tasks (id, project_id, tenant_id, title)
SELECT gen_random_uuid(), p.id, p.tenant_id, 'Implement Auth'
FROM projects p OFFSET 1 LIMIT 1;

INSERT INTO tasks (id, project_id, tenant_id, title)
SELECT gen_random_uuid(), p.id, p.tenant_id, 'Create APIs'
FROM projects p OFFSET 1 LIMIT 1;

INSERT INTO tasks (id, project_id, tenant_id, title)
SELECT gen_random_uuid(), p.id, p.tenant_id, 'Frontend Integration'
FROM projects p OFFSET 1 LIMIT 1;
