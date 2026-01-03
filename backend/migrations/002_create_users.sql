-- =====================================================
-- USER ROLE ENUM (SAFE CREATION)
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'user_role'
    ) THEN
        CREATE TYPE user_role AS ENUM (
            'super_admin',
            'tenant_admin',
            'user'
        );
    END IF;
END$$;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE
);

-- =====================================================
-- UNIQUE CONSTRAINTS (POSTGRES SAFE)
-- =====================================================

-- One super admin email (no tenant)
CREATE UNIQUE INDEX IF NOT EXISTS unique_super_admin_email
ON users(email)
WHERE tenant_id IS NULL;

-- Unique email per tenant
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_per_tenant
ON users(tenant_id, email)
WHERE tenant_id IS NOT NULL;
