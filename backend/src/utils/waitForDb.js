import pool from "../config/db.js";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function waitForDb(retries = 10) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("Database connected");
      return;
    } catch (err) {
      console.log(`Waiting for DB... (${i}/${retries})`);
      await sleep(3000);
    }
  }
  throw new Error("Database not reachable");
}
