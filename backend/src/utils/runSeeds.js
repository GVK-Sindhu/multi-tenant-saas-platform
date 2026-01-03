import bcrypt from "bcryptjs";
import pool from "../config/db.js";

export const runSeeds = async () => {
  console.log("Running seed data...");

  //  SUPER ADMIN
  const superAdminEmail = "superadmin@system.com";

  const superAdminCheck = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [superAdminEmail]
  );

  if (superAdminCheck.rows.length === 0) {
    const hashedPassword = await bcrypt.hash("Super@123", 10);

    await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, 'super_admin', true)`,
      [superAdminEmail, hashedPassword, "System Admin"]
    );

    console.log(" Super admin seeded");
  } else {
    console.log(" Super admin already exists, skipping");
  }

  //  DEMO TENANT
  const tenantCheck = await pool.query(
    "SELECT id FROM tenants WHERE subdomain = 'demo'"
  );

  let tenantId;
  if (tenantCheck.rows.length === 0) {
    const tenantResult = await pool.query(
      `INSERT INTO tenants (name, subdomain, status, subscription_plan, max_users, max_projects)
       VALUES ('Demo Tenant', 'demo', 'active', 'free', 10, 10)
       RETURNING id`
    );
    tenantId = tenantResult.rows[0].id;
    console.log(" Demo tenant seeded");
  } else {
    tenantId = tenantCheck.rows[0].id;
    console.log(" Demo tenant already exists, skipping");
  }

  //  TENANT ADMIN
  const adminEmail = "admin@demo.com";

  const adminCheck = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [adminEmail]
  );

  if (adminCheck.rows.length === 0) {
    const hashedPassword = await bcrypt.hash("Demo@123", 10);

    await pool.query(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, 'tenant_admin', true)`,
      [tenantId, adminEmail, hashedPassword, "Demo Admin"]
    );

    console.log(" Tenant admin seeded");
  } else {
    console.log("Tenant admin already exists, skipping");
  }

  console.log("Seed data completed");
};
