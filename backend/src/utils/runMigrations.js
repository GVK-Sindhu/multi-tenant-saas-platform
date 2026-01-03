// import pool from '../config/db.js';
// import fs from 'fs';
// import path from 'path';

// const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// export const runMigrations = async () => {
//   //  Wait for DB
//   for (let i = 1; i <= 10; i++) {
//     try {
//       console.log(`Trying DB connection (attempt ${i})...`);
//       await pool.query('SELECT 1');
//       console.log('Database connected');
//       break;
//     } catch {
//       console.log('DB not ready, retrying...');
//       await sleep(3000);
//     }
//   }

//   //  Ensure migrations table exists
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS migrations (
//       id SERIAL PRIMARY KEY,
//       filename TEXT UNIQUE NOT NULL,
//       applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `);

//   // Get already-applied migrations
//   const applied = await pool.query(
//     'SELECT filename FROM migrations'
//   );
//   const appliedFiles = new Set(applied.rows.map(r => r.filename));

//   // Read migration files
//   const migrationsDir = path.join(process.cwd(), 'migrations');
//   const files = fs.readdirSync(migrationsDir).sort();

//   // Run only NEW migrations
//   for (const file of files) {
//     if (appliedFiles.has(file)) {
//       continue; 
//     }

//     const fullPath = path.join(migrationsDir, file);
//     const rawSql = fs.readFileSync(fullPath, 'utf-8');

//     const upSql = rawSql
//       .split('-- DOWN')[0]
//       .replace('-- UP', '')
//       .trim();

//     if (!upSql) continue;

//     await pool.query(upSql);

//     await pool.query(
//       'INSERT INTO migrations (filename) VALUES ($1)',
//       [file]
//     );

//     console.log(` Migration applied: ${file}`);
//   }
// };
