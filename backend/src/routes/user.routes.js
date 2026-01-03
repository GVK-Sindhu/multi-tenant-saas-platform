import express from 'express';
import pool from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { tenantIsolation } from '../middleware/tenantMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

/**
 * POST /api/tenants/:tenantId/users
 * Add user to tenant (tenant_admin only)
 */
router.post(
  '/',
  authMiddleware,
  tenantIsolation,
  authorizeRoles('tenant_admin'),
  async (req, res) => {
    const { tenantId } = req.params;
    const { email, password, fullName, role = 'user' } = req.body;
    const currentUser = req.user;

    if (tenantId !== currentUser.tenantId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM users WHERE tenant_id = $1',
        [tenantId]
      );

      const tenantResult = await pool.query(
        'SELECT max_users FROM tenants WHERE id = $1',
        [tenantId]
      );

      if (!tenantResult.rows.length) {
        return res.status(404).json({ success: false, message: 'Tenant not found' });
      }

      if (Number(countResult.rows[0].count) >= tenantResult.rows[0].max_users) {
        return res.status(403).json({ success: false, message: 'User limit reached' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `
        INSERT INTO users (tenant_id, email, password_hash, full_name, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, full_name, role, is_active, created_at
        `,
        [tenantId, email, hashedPassword, fullName, role]
      );

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: result.rows[0].id,
          email: result.rows[0].email,
          fullName: result.rows[0].full_name,
          role: result.rows[0].role,
          tenantId,
          isActive: result.rows[0].is_active,
          createdAt: result.rows[0].created_at
        }
      });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ success: false, message: 'Email already exists in this tenant' });
      }
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/**
 * GET /api/tenants/:tenantId/users
 * List users of tenant (API-9)
 */
router.get(
  '/',
  authMiddleware,
  tenantIsolation,
  async (req, res) => {
    const { tenantId } = req.params;
    const { search = '', role, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    try {
      let filters = [`tenant_id = $1`];
      let values = [tenantId];
      let idx = 2;

      if (search) {
        filters.push(`(email ILIKE $${idx} OR full_name ILIKE $${idx})`);
        values.push(`%${search}%`);
        idx++;
      }

      if (role) {
        filters.push(`role = $${idx}`);
        values.push(role);
        idx++;
      }

      const usersResult = await pool.query(
        `
        SELECT id, email, full_name, role, is_active, created_at
        FROM users
        WHERE ${filters.join(' AND ')}
        ORDER BY created_at DESC
        LIMIT $${idx} OFFSET $${idx + 1}
        `,
        [...values, limit, offset]
      );

      const countResult = await pool.query(
        `SELECT COUNT(*) FROM users WHERE ${filters.join(' AND ')}`,
        values
      );

      return res.json({
        success: true,
        data: {
          users: usersResult.rows.map(u => ({
            id: u.id,
            email: u.email,
            fullName: u.full_name,
            role: u.role,
            isActive: u.is_active,
            createdAt: u.created_at
          })),
          total: Number(countResult.rows[0].count),
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(countResult.rows[0].count / limit),
            limit: Number(limit)
          }
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

export default router;
