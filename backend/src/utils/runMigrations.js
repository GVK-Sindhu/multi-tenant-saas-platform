import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';

const migrationsDir = path.resolve('backend/migrations');

export async function runMigrations() {
  const client = await pool.connect();
  try {
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(
        path.join(migrationsDir, file),
        'utf8'
      );

      const upSql = sql.split('-- DOWN')[0];
      await client.query(upSql);
      console.log(` Migration applied: ${file}`);
    }
  } finally {
    client.release();
  }
}
