-- =====================================================
-- TENANT
-- =====================================================
INSERT INTO tenants (
    id,
    name,
    subdomain,
    status,
    subscription_plan,
    max_users,
    max_projects,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'Demo Company',
    'demo',
    'active',
    'pro',
    25,
    15,
    NOW(),
    NOW()
)
ON CONFLICT (subdomain) DO NOTHING;

-- =====================================================
-- SUPER ADMIN (NO TENANT)
-- Password: Admin@123
-- =====================================================
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    NULL,
    'superadmin@system.com',
    '$2a$10$sTJF6v2Y58gyuhCCsQxJlO4yj5VDI9swDh5XT6qo4AjXuIvbamM2e',
    'System Super Admin',
    'super_admin',
    true,
    NOW(),
    NOW()
);

-- =====================================================
-- TENANT ADMIN
-- Password: Demo@123
-- =====================================================
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'admin@demo.com',
    '$2a$10$lKLpaIsM.TpMqZr4I13eEO84ROHeHNcOaeHueRtDhAetcFGrMZa9O',
    'Demo Admin',
    'tenant_admin',
    true,
    NOW(),
    NOW()
FROM tenants t
WHERE t.subdomain = 'demo';

-- =====================================================
-- REGULAR USERS
-- Password: User@123
-- =====================================================
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'user1@demo.com',
    '$2a$10$aig7jvFZaJZgLT5LT/lNx.1zclzZwl3rO5r1RzUdsCeg2sNWj2WCO',
    'Demo User One',
    'user',
    true,
    NOW(),
    NOW()
FROM tenants t
WHERE t.subdomain = 'demo';

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'user2@demo.com',
    '$2a$10$aig7jvFZaJZgLT5LT/lNx.1zclzZwl3rO5r1RzUdsCeg2sNWj2WCO',
    'Demo User Two',
    'user',
    true,
    NOW(),
    NOW()
FROM tenants t
WHERE t.subdomain = 'demo';

-- =====================================================
-- PROJECTS
-- =====================================================
INSERT INTO projects (
    id,
    tenant_id,
    name,
    description,
    created_by,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'Project Alpha',
    'First demo project',
    u.id,
    NOW(),
    NOW()
FROM tenants t
JOIN users u ON u.tenant_id = t.id AND u.role = 'tenant_admin'
WHERE t.subdomain = 'demo'
LIMIT 1;

INSERT INTO projects (
    id,
    tenant_id,
    name,
    description,
    created_by,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    'Project Beta',
    'Second demo project',
    u.id,
    NOW(),
    NOW()
FROM tenants t
JOIN users u ON u.tenant_id = t.id AND u.role = 'tenant_admin'
WHERE t.subdomain = 'demo'
LIMIT 1;

-- =====================================================
-- TASKS
-- =====================================================
INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    status,
    priority,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Initial Setup',
    'todo',
    'high',
    NOW(),
    NOW()
FROM projects p
WHERE p.name = 'Project Alpha';

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Design Database Schema',
    NOW(),
    NOW()
FROM projects p
WHERE p.name = 'Project Alpha';

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Implement Auth',
    NOW(),
    NOW()
FROM projects p
WHERE p.name = 'Project Beta';

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Create APIs',
    NOW(),
    NOW()
FROM projects p
WHERE p.name = 'Project Beta';

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    p.id,
    p.tenant_id,
    'Frontend Integration',
    NOW(),
    NOW()
FROM projects p
WHERE p.name = 'Project Beta';
