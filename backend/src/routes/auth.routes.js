// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import pool from '../config/db.js';
// import authMiddleware from '../middleware/authMiddleware.js';
// import { getCurrentUser } from '../controllers/auth.controller.js';

// const router = express.Router();

// /**
//  * POST /api/auth/register-tenant
//  */
// router.post('/register-tenant', async (req, res) => {
//   const {
//     tenantName,
//     subdomain,
//     adminEmail,
//     adminPassword,
//     adminFullName
//   } = req.body;

//   if (!tenantName || !subdomain || !adminEmail || !adminPassword || !adminFullName) {
//     return res.status(400).json({
//       success: false,
//       message: 'All fields are required'
//     });
//   }

//   const client = await pool.connect();

//   try {
//     await client.query('BEGIN');

//     const subdomainCheck = await client.query(
//       'SELECT id FROM tenants WHERE subdomain = $1',
//       [subdomain]
//     );

//     if (subdomainCheck.rows.length > 0) {
//       await client.query('ROLLBACK');
//       return res.status(409).json({
//         success: false,
//         message: 'Subdomain already exists'
//       });
//     }

//     const tenantResult = await client.query(
//       `INSERT INTO tenants (name, subdomain, subscription_plan, max_users, max_projects)
//        VALUES ($1, $2, 'free', 5, 3)
//        RETURNING id`,
//       [tenantName, subdomain]
//     );

//     const tenantId = tenantResult.rows[0].id;
//     const hashedPassword = await bcrypt.hash(adminPassword, 10);

//     const userResult = await client.query(
//       `INSERT INTO users (tenant_id, email, password_hash, full_name, role)
//        VALUES ($1, $2, $3, $4, 'tenant_admin')
//        RETURNING id, email, full_name, role`,
//       [tenantId, adminEmail, hashedPassword, adminFullName]
//     );

//     await client.query('COMMIT');

//     return res.status(201).json({
//       success: true,
//       message: 'Tenant registered successfully',
//       data: {
//         tenantId,
//         subdomain,
//         adminUser: {
//           id: userResult.rows[0].id,
//           email: userResult.rows[0].email,
//           fullName: userResult.rows[0].full_name,
//           role: userResult.rows[0].role
//         }
//       }
//     });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   } finally {
//     client.release();
//   }
// });

// /**
//  * POST /api/auth/login
//  */
// router.post('/login', async (req, res) => {
//   const { email, password, tenantSubdomain } = req.body;

//   if (!email || !password || !tenantSubdomain) {
//     return res.status(400).json({
//       success: false,
//       message: 'Email, password and tenant subdomain are required'
//     });
//   }

//   try {
//     const tenantResult = await pool.query(
//       'SELECT id, status FROM tenants WHERE subdomain = $1',
//       [tenantSubdomain]
//     );

//     if (tenantResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Tenant not found'
//       });
//     }

//     const tenant = tenantResult.rows[0];

//     if (tenant.status !== 'active') {
//       return res.status(403).json({
//         success: false,
//         message: 'Tenant is not active'
//       });
//     }

//     const userResult = await pool.query(
//       `SELECT id, email, password_hash, full_name, role, is_active
//        FROM users
//        WHERE email = $1 AND tenant_id = $2`,
//       [email, tenant.id]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     const user = userResult.rows[0];

//     if (!user.is_active) {
//       return res.status(403).json({
//         success: false,
//         message: 'Account is inactive'
//       });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password_hash);
//     if (!passwordMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     const token = jwt.sign(
//   {
//     userId: user.id,
//     tenantId: tenant.id,
//     role: user.role
//   },
//   process.env.JWT_SECRET,
//   { expiresIn: '1d' }
// );


//     return res.status(200).json({
//       success: true,
//       data: {
//         user: {
//           id: user.id,
//           email: user.email,
//           fullName: user.full_name,
//           role: user.role,
//           tenantId: tenant.id
//         },
//         token,
//         expiresIn: 86400
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// /**
//  * GET /api/auth/me  (SPEC)
//  */
// router.get('/me', authMiddleware, getCurrentUser);

// export default router;

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/auth/register-tenant
 */
router.post("/register-tenant", async (req, res) => {
  const {
    tenantName,
    subdomain,
    adminEmail,
    adminPassword,
    adminFullName,
  } = req.body;

  if (!tenantName || !subdomain || !adminEmail || !adminPassword || !adminFullName) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const subdomainCheck = await client.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [subdomain]
    );

    if (subdomainCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Subdomain already exists",
      });
    }

    const tenantResult = await client.query(
      `INSERT INTO tenants (name, subdomain, subscription_plan, max_users, max_projects)
       VALUES ($1, $2, 'free', 5, 3)
       RETURNING id`,
      [tenantName, subdomain]
    );

    const tenantId = tenantResult.rows[0].id;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const userResult = await client.query(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, 'tenant_admin')
       RETURNING id, email, full_name, role`,
      [tenantId, adminEmail, hashedPassword, adminFullName]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: {
        tenantId,
        subdomain,
        adminUser: {
          id: userResult.rows[0].id,
          email: userResult.rows[0].email,
          fullName: userResult.rows[0].full_name,
          role: userResult.rows[0].role,
        },
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  } finally {
    client.release();
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;

  if (!email || !password || !tenantSubdomain) {
    return res.status(400).json({
      success: false,
      message: "Email, password and tenant subdomain are required",
    });
  }

  try {
    const tenantResult = await pool.query(
      "SELECT id, status FROM tenants WHERE subdomain = $1",
      [tenantSubdomain]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    const tenant = tenantResult.rows[0];

    if (tenant.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Tenant is not active",
      });
    }

    const userResult = await pool.query(
      `SELECT id, email, password_hash, full_name, role, is_active
       FROM users
       WHERE email = $1 AND tenant_id = $2`,
      [email, tenant.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: tenant.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId: tenant.id,
        },
        token,
        expiresIn: 86400,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * GET /api/auth/me  
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { userId, tenantId } = req.user;

    const result = await pool.query(
      `SELECT id, email, full_name, role
       FROM users
       WHERE id = $1 AND tenant_id = $2`,
      [userId, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        tenantId,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
