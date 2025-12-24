import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { tenantIsolation } from '../middleware/tenantMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * GET /api/tenants/:tenantId
 */
router.get(
  '/:tenantId',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { tenantId } = req.params;
    const user = req.user;

    // tenant users can only access their own tenant
    if (user.role !== 'super_admin' && tenantId !== user.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    try {
      const tenantResult = await pool.query(
        `SELECT id, name, subdomain, status, subscription_plan,
                max_users, max_projects, created_at
         FROM tenants
         WHERE id = $1`,
        [tenantId]
      );

      if (tenantResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tenant not found'
        });
      }

      const statsResult = await pool.query(
        `
        SELECT
          (SELECT COUNT(*) FROM users WHERE tenant_id = $1) AS total_users,
          (SELECT COUNT(*) FROM projects WHERE tenant_id = $1) AS total_projects,
          (SELECT COUNT(*) FROM tasks WHERE tenant_id = $1) AS total_tasks
        `,
        [tenantId]
      );

      return res.json({
        success: true,
        data: {
          ...tenantResult.rows[0],
          stats: {
            totalUsers: Number(statsResult.rows[0].total_users),
            totalProjects: Number(statsResult.rows[0].total_projects),
            totalTasks: Number(statsResult.rows[0].total_tasks)
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
 * PUT /api/tenants/:tenantId
 */
router.put(
  '/:tenantId',
  authenticate,
  tenantIsolation,
  authorizeRoles('tenant_admin', 'super_admin'),
  async (req, res) => {
    const { tenantId } = req.params;
    const user = req.user;
    const { name, status, subscriptionPlan, maxUsers, maxProjects } = req.body;

    // tenant_admin can ONLY update name
    if (user.role === 'tenant_admin') {
      if (tenantId !== user.tenantId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      await pool.query(
        'UPDATE tenants SET name = $1, updated_at = NOW() WHERE id = $2',
        [name, tenantId]
      );

      return res.json({
        success: true,
        message: 'Tenant updated successfully'
      });
    }

    // super_admin can update everything
    await pool.query(
      `
      UPDATE tenants
      SET
        name = COALESCE($1, name),
        status = COALESCE($2, status),
        subscription_plan = COALESCE($3, subscription_plan),
        max_users = COALESCE($4, max_users),
        max_projects = COALESCE($5, max_projects),
        updated_at = NOW()
      WHERE id = $6
      `,
      [name, status, subscriptionPlan, maxUsers, maxProjects, tenantId]
    );

    return res.json({
      success: true,
      message: 'Tenant updated successfully'
    });
  }
);

/**
 * GET /api/tenants (super_admin only)
 */
router.get(
  '/',
  authenticate,
  authorizeRoles('super_admin'),
  async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
      const tenantsResult = await pool.query(
        `
        SELECT
          t.id, t.name, t.subdomain, t.status, t.subscription_plan,
          t.created_at,
          (SELECT COUNT(*) FROM users u WHERE u.tenant_id = t.id) AS total_users,
          (SELECT COUNT(*) FROM projects p WHERE p.tenant_id = t.id) AS total_projects
        FROM tenants t
        ORDER BY t.created_at DESC
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
      );

      const countResult = await pool.query('SELECT COUNT(*) FROM tenants');

      return res.json({
        success: true,
        data: {
          tenants: tenantsResult.rows,
          pagination: {
            currentPage: Number(page),
            totalTenants: Number(countResult.rows[0].count),
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

export default router;
