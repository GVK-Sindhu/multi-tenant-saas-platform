import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { tenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

/**
 * POST /api/projects
 * Create project
 */
router.post(
  '/projects',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { name, description, status = 'active' } = req.body;
    const { tenantId, userId } = req.user;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    try {
      // enforce project limit
      const tenantResult = await pool.query(
        'SELECT max_projects FROM tenants WHERE id = $1',
        [tenantId]
      );

      const countResult = await pool.query(
        'SELECT COUNT(*) FROM projects WHERE tenant_id = $1',
        [tenantId]
      );

      if (
        Number(countResult.rows[0].count) >=
        tenantResult.rows[0].max_projects
      ) {
        return res.status(403).json({
          success: false,
          message: 'Project limit reached for this subscription'
        });
      }

      const projectResult = await pool.query(
        `
        INSERT INTO projects (tenant_id, name, description, status, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, tenant_id, name, description, status, created_by, created_at
        `,
        [tenantId, name, description, status, userId]
      );

      return res.status(201).json({
        success: true,
        data: projectResult.rows[0]
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
 * GET /api/projects
 * List projects
 */
router.get(
  '/projects',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { tenantId } = req.user;
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    try {
      let baseQuery = `
        SELECT
          p.id,
          p.name,
          p.description,
          p.status,
          p.created_at,
          u.id AS creator_id,
          u.full_name AS creator_name,
          (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS task_count,
          (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'completed') AS completed_task_count
        FROM projects p
        JOIN users u ON u.id = p.created_by
        WHERE p.tenant_id = $1
      `;
      const values = [tenantId];

      if (status) {
        values.push(status);
        baseQuery += ` AND p.status = $${values.length}`;
      }

      if (search) {
        values.push(`%${search}%`);
        baseQuery += ` AND p.name ILIKE $${values.length}`;
      }

      baseQuery += `
        ORDER BY p.created_at DESC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
      `;
      values.push(limit, offset);

      const projectsResult = await pool.query(baseQuery, values);

      const countResult = await pool.query(
        'SELECT COUNT(*) FROM projects WHERE tenant_id = $1',
        [tenantId]
      );

      return res.json({
        success: true,
        data: {
          projects: projectsResult.rows.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            status: p.status,
            createdAt: p.created_at,
            createdBy: {
              id: p.creator_id,
              fullName: p.creator_name
            },
            taskCount: Number(p.task_count),
            completedTaskCount: Number(p.completed_task_count)
          })),
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
 * PUT /api/projects/:projectId
 * Update project
 */
router.put(
  '/projects/:projectId',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { projectId } = req.params;
    const { name, description, status } = req.body;
    const { tenantId, userId, role } = req.user;

    try {
      const projectResult = await pool.query(
        'SELECT tenant_id, created_by FROM projects WHERE id = $1',
        [projectId]
      );

      if (projectResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const project = projectResult.rows[0];

      if (
        project.tenant_id !== tenantId ||
        (role !== 'tenant_admin' && project.created_by !== userId)
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      await pool.query(
        `
        UPDATE projects
        SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          updated_at = NOW()
        WHERE id = $4
        `,
        [name, description, status, projectId]
      );

      return res.json({
        success: true,
        message: 'Project updated successfully'
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
 * DELETE /api/projects/:projectId
 */
router.delete(
  '/projects/:projectId',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { projectId } = req.params;
    const { tenantId, userId, role } = req.user;

    try {
      const projectResult = await pool.query(
        'SELECT tenant_id, created_by FROM projects WHERE id = $1',
        [projectId]
      );

      if (projectResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const project = projectResult.rows[0];

      if (
        project.tenant_id !== tenantId ||
        (role !== 'tenant_admin' && project.created_by !== userId)
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);

      return res.json({
        success: true,
        message: 'Project deleted successfully'
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
