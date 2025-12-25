import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const runMigrations = async () => {
  // wait for DB
  for (let i = 1; i <= 10; i++) {
    try {
      console.log(`Trying DB connection (attempt ${i})...`);
      await pool.query('SELECT 1');
      console.log('Database connected');
      break;
    } catch {
      console.log('DB not ready, retrying...');
      await sleep(3000);
    }
  }

  const migrationsDir = path.join(process.cwd(), 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const rawSql = fs.readFileSync(fullPath, 'utf-8');

    // ONLY run UP migration
    const upSql = rawSql.split('-- DOWN')[0].replace('-- UP', '').trim();

    if (!upSql) continue;

    await pool.query(upSql);
    console.log(` Migration applied: ${file}`);
  }
};
