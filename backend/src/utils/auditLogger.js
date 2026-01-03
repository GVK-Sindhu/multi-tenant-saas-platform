import pool from '../config/db.js';

export async function logAudit({
  tenantId,
  userId,
  action,
  entityType,
  entityId
}) {
  try {
    console.log('AUDIT START:', action, entityType);

    const result = await pool.query(
      `
      INSERT INTO audit_logs
      (id, tenant_id, user_id, action, entity_type, entity_id, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
      RETURNING id
      `,
      [tenantId, userId, action, entityType, entityId]
    );

    console.log(' AUDIT INSERTED:', result.rows[0].id);
  } catch (err) {
    console.error('AUDIT FAILED:', err.message);
    throw err;
  }
}
