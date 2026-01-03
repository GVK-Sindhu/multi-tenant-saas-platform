import fs from "fs";
import path from "path";
import pool from "../src/config/db.js";

export async function runMigrations() {
  console.log("Running migrations...");

  const migrationsDir = path.join(process.cwd(), "migrations");
 const files = fs
  .readdirSync(migrationsDir)
  .filter(file => file.endsWith(".sql"))
  .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");

    // only UP section
    const upSql = sql.split("-- DOWN")[0].replace("-- UP", "").trim();
    if (!upSql) continue;

    console.log(` Applying ${file}`);
    await pool.query(upSql);
  }

  console.log(" Migrations completed");
}
