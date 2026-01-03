import express from 'express';
import pool from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { logAudit } from '../utils/auditLogger.js';

const router = express.Router();

/**
 * POST /api/projects
 * Create new project
 */
router.post('/', authMiddleware, async (req, res) => {
  console.log('CREATE PROJECT ROUTE HIT');

  const { name, description, status = 'active' } = req.body;
  const { tenantId, userId } = req.user;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Project name is required'
    });
  }

  try {
    // Get tenant limits
    const tenantResult = await pool.query(
      'SELECT max_projects FROM tenants WHERE id = $1',
      [tenantId]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    const maxProjects = tenantResult.rows[0].max_projects;

    // Count existing projects
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM projects WHERE tenant_id = $1',
      [tenantId]
    );

    const currentProjects = Number(countResult.rows[0].count);

    if (currentProjects >= maxProjects) {
      return res.status(403).json({
        success: false,
        message: 'Project limit reached for your subscription plan'
      });
    }

    // Create project
    const result = await pool.query(
      `
      INSERT INTO projects (tenant_id, name, description, status, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, tenant_id, name, description, status, created_by, created_at
      `,
      [tenantId, name, description, status, userId]
    );

    await logAudit({
      tenantId,
      userId,
      action: 'CREATE_PROJECT',
      entityType: 'project',
      entityId: result.rows[0].id
    });

    return res.status(201).json({
      success: true,
      data: {
        id: result.rows[0].id,
        tenantId: result.rows[0].tenant_id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        status: result.rows[0].status,
        createdBy: result.rows[0].created_by,
        createdAt: result.rows[0].created_at
      }
    });
  } catch (err) {
    console.error('Create project error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * GET /api/projects
 * List projects
 */
router.get('/', authMiddleware, async (req, res) => {
  const { tenantId } = req.user;

  try {
    const result = await pool.query(
      `
      SELECT p.id, p.name, p.description, p.status, p.created_at,
             u.id AS creator_id, u.full_name AS creator_name
      FROM projects p
      JOIN users u ON p.created_by = u.id
      WHERE p.tenant_id = $1
      ORDER BY p.created_at DESC
      `,
      [tenantId]
    );

    return res.json({
      success: true,
      data: {
        projects: result.rows.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: p.status,
          createdAt: p.created_at,
          createdBy: {
            id: p.creator_id,
            fullName: p.creator_name
          }
        }))
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
