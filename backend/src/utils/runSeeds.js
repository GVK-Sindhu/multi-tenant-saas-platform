import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';

export async function runSeeds() {
  const seedPath = path.resolve('backend/seeds/seed_data.sql');
  const sql = fs.readFileSync(seedPath, 'utf8');
  await pool.query(sql);
  console.log(' Seed data inserted');
}
