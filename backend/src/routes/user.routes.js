import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { tenantIsolation } from '../middleware/tenantMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * POST /api/tenants/:tenantId/users
 * Add user to tenant
 */
router.post(
  '/tenants/:tenantId/users',
  authenticate,
  tenantIsolation,
  authorizeRoles('tenant_admin'),
  async (req, res) => {
    const { tenantId } = req.params;
    const { email, password, fullName, role = 'user' } = req.body;

    if (tenantId !== req.user.tenantId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    try {
      // check subscription user limit
      const tenantResult = await pool.query(
        'SELECT max_users FROM tenants WHERE id = $1',
        [tenantId]
      );

      const userCountResult = await pool.query(
        'SELECT COUNT(*) FROM users WHERE tenant_id = $1',
        [tenantId]
      );

      if (
        Number(userCountResult.rows[0].count) >=
        tenantResult.rows[0].max_users
      ) {
        return res.status(403).json({
          success: false,
          message: 'User limit reached for this subscription'
        });
      }

      // check email uniqueness per tenant
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE tenant_id = $1 AND email = $2',
        [tenantId, email]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists in this tenant'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userResult = await pool.query(
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
        data: userResult.rows[0]
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

/**
 * GET /api/tenants/:tenantId/users
 * List users
 */
router.get(
  '/tenants/:tenantId/users',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { tenantId } = req.params;
    const { search, role, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    if (tenantId !== req.user.tenantId && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
      let baseQuery = `
        SELECT id, email, full_name, role, is_active, created_at
        FROM users
        WHERE tenant_id = $1
      `;
      const values = [tenantId];

      if (search) {
        values.push(`%${search}%`);
        baseQuery += ` AND (email ILIKE $${values.length} OR full_name ILIKE $${values.length})`;
      }

      if (role) {
        values.push(role);
        baseQuery += ` AND role = $${values.length}`;
      }

      baseQuery += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);

      const usersResult = await pool.query(baseQuery, values);

      const countResult = await pool.query(
        'SELECT COUNT(*) FROM users WHERE tenant_id = $1',
        [tenantId]
      );

      return res.json({
        success: true,
        data: {
          users: usersResult.rows,
          total: Number(countResult.rows[0].count),
          pagination: {
            currentPage: Number(page),
            limit: Number(limit)
          }
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

/**
 * PUT /api/users/:userId
 * Update user
 */
router.put(
  '/users/:userId',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { userId } = req.params;
    const { fullName, role, isActive } = req.body;

    try {
      const userResult = await pool.query(
        'SELECT tenant_id FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (
        userResult.rows[0].tenant_id !== req.user.tenantId &&
        req.user.role !== 'super_admin'
      ) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      // self update allowed only for fullName
      if (req.user.userId === userId && (role || isActive !== undefined)) {
        return res.status(403).json({
          success: false,
          message: 'Not allowed to update role or status'
        });
      }

      await pool.query(
        `
        UPDATE users
        SET
          full_name = COALESCE($1, full_name),
          role = COALESCE($2, role),
          is_active = COALESCE($3, is_active),
          updated_at = NOW()
        WHERE id = $4
        `,
        [fullName, role, isActive, userId]
      );

      return res.json({
        success: true,
        message: 'User updated successfully'
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

/**
 * DELETE /api/users/:userId
 */
router.delete(
  '/users/:userId',
  authenticate,
  tenantIsolation,
  authorizeRoles('tenant_admin'),
  async (req, res) => {
    const { userId } = req.params;

    if (req.user.userId === userId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete yourself'
      });
    }

    try {
      const userResult = await pool.query(
        'SELECT tenant_id FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (userResult.rows[0].tenant_id !== req.user.tenantId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      await pool.query(
        'UPDATE tasks SET assigned_to = NULL WHERE assigned_to = $1',
        [userId]
      );

      await pool.query('DELETE FROM users WHERE id = $1', [userId]);

      return res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

export default router;
