import express from 'express';
import pool from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { tenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

/**
 * CREATE TASK
 * POST /api/projects/:projectId/tasks
 */
router.post(
  '/projects/:projectId/tasks',
  authMiddleware,
  tenantIsolation,
  async (req, res) => {
    const { projectId } = req.params;
    const { title, description, priority = 'medium', assignedTo, dueDate } = req.body;
    const user = req.user;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    try {
      const project = await pool.query(
        'SELECT tenant_id FROM projects WHERE id = $1',
        [projectId]
      );

      if (!project.rows.length) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      if (project.rows[0].tenant_id !== user.tenantId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      if (assignedTo) {
        const u = await pool.query(
          'SELECT id FROM users WHERE id = $1 AND tenant_id = $2',
          [assignedTo, user.tenantId]
        );
        if (!u.rows.length) {
          return res.status(400).json({
            success: false,
            message: 'Assigned user does not belong to tenant'
          });
        }
      }

      const result = await pool.query(
        `
        INSERT INTO tasks
        (project_id, tenant_id, title, description, priority, assigned_to, due_date)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `,
        [projectId, user.tenantId, title, description || null, priority, assignedTo || null, dueDate || null]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/**
 * LIST TASKS
 * GET /api/projects/:projectId/tasks
 */
router.get(
  '/projects/:projectId/tasks',
  authMiddleware,
  tenantIsolation,
  async (req, res) => {
    const { projectId } = req.params;
    const user = req.user;

    const result = await pool.query(
      'SELECT * FROM tasks WHERE project_id = $1 AND tenant_id = $2 ORDER BY created_at DESC',
      [projectId, user.tenantId]
    );

    res.json({ success: true, data: { tasks: result.rows } });
  }
);

/**
 * UPDATE TASK STATUS
 * PATCH /api/tasks/:taskId/status
 */
router.patch(
  '/tasks/:taskId/status',
  authMiddleware,
  tenantIsolation,
  async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const user = req.user;

    const result = await pool.query(
      `
      UPDATE tasks
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND tenant_id = $3
      RETURNING *
      `,
      [status, taskId, user.tenantId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  }
);

/**
 * UPDATE TASK (FULL)
 * PUT /api/tasks/:taskId
 */
router.put(
  '/tasks/:taskId',
  authMiddleware,
  tenantIsolation,
  async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    const user = req.user;

    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        priority = COALESCE($4, priority),
        assigned_to = $5,
        due_date = $6,
        updated_at = NOW()
      WHERE id = $7 AND tenant_id = $8
      RETURNING *
      `,
      [
        title || null,
        description || null,
        status || null,
        priority || null,
        assignedTo ?? null,
        dueDate ?? null,
        taskId,
        user.tenantId
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task updated successfully', data: result.rows[0] });
  }
);

export default router;
