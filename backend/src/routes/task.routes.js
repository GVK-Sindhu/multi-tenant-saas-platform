import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { tenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

/**
 * POST /api/projects/:projectId/tasks
 * Create task
 */
router.post(
  '/projects/:projectId/tasks',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { projectId } = req.params;
    const { title, description, assignedTo, priority = 'medium', dueDate } = req.body;
    const { tenantId } = req.user;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    try {
      // verify project belongs to tenant
      const projectResult = await pool.query(
        'SELECT tenant_id FROM projects WHERE id = $1',
        [projectId]
      );

      if (
        projectResult.rows.length === 0 ||
        projectResult.rows[0].tenant_id !== tenantId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Project does not belong to your tenant'
        });
      }

      // verify assigned user (if provided)
      if (assignedTo) {
        const userCheck = await pool.query(
          'SELECT id FROM users WHERE id = $1 AND tenant_id = $2',
          [assignedTo, tenantId]
        );

        if (userCheck.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Assigned user does not belong to tenant'
          });
        }
      }

      const taskResult = await pool.query(
        `
        INSERT INTO tasks
          (project_id, tenant_id, title, description, status, priority, assigned_to, due_date)
        VALUES
          ($1, $2, $3, $4, 'todo', $5, $6, $7)
        RETURNING *
        `,
        [projectId, tenantId, title, description, priority, assignedTo, dueDate]
      );

      return res.status(201).json({
        success: true,
        data: taskResult.rows[0]
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/**
 * GET /api/projects/:projectId/tasks
 * List tasks
 */
router.get(
  '/projects/:projectId/tasks',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { projectId } = req.params;
    const { status, assignedTo, priority, search, page = 1, limit = 50 } = req.query;
    const { tenantId } = req.user;
    const offset = (page - 1) * limit;

    try {
      let query = `
        SELECT
          t.id, t.title, t.description, t.status, t.priority, t.due_date, t.created_at,
          u.id AS user_id, u.full_name, u.email
        FROM tasks t
        LEFT JOIN users u ON u.id = t.assigned_to
        WHERE t.project_id = $1 AND t.tenant_id = $2
      `;
      const values = [projectId, tenantId];

      if (status) {
        values.push(status);
        query += ` AND t.status = $${values.length}`;
      }

      if (assignedTo) {
        values.push(assignedTo);
        query += ` AND t.assigned_to = $${values.length}`;
      }

      if (priority) {
        values.push(priority);
        query += ` AND t.priority = $${values.length}`;
      }

      if (search) {
        values.push(`%${search}%`);
        query += ` AND t.title ILIKE $${values.length}`;
      }

      query += `
        ORDER BY t.priority DESC, t.due_date ASC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
      `;
      values.push(limit, offset);

      const tasksResult = await pool.query(query, values);

      return res.json({
        success: true,
        data: {
          tasks: tasksResult.rows.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            dueDate: t.due_date,
            createdAt: t.created_at,
            assignedTo: t.user_id
              ? {
                  id: t.user_id,
                  fullName: t.full_name,
                  email: t.email
                }
              : null
          })),
          pagination: {
            currentPage: Number(page),
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

/**
 * PATCH /api/tasks/:taskId/status
 * Update task status
 */
router.patch(
  '/tasks/:taskId/status',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const { tenantId } = req.user;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    try {
      const result = await pool.query(
        `
        UPDATE tasks
        SET status = $1, updated_at = NOW()
        WHERE id = $2 AND tenant_id = $3
        RETURNING id, status, updated_at
        `,
        [status, taskId, tenantId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      return res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/**
 * PUT /api/tasks/:taskId
 * Update task (full)
 */
router.put(
  '/tasks/:taskId',
  authenticate,
  tenantIsolation,
  async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    const { tenantId } = req.user;

    try {
      // verify assigned user (if provided)
      if (assignedTo !== undefined && assignedTo !== null) {
        const userCheck = await pool.query(
          'SELECT id FROM users WHERE id = $1 AND tenant_id = $2',
          [assignedTo, tenantId]
        );

        if (userCheck.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Assigned user does not belong to tenant'
          });
        }
      }

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
        [title, description, status, priority, assignedTo, dueDate, taskId, tenantId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      return res.json({
        success: true,
        message: 'Task updated successfully',
        data: result.rows[0]
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

export default router;
