// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import pool from "./config/db.js";
// // import { runSeeds } from "./utils/runSeeds.js";

// import authRoutes from "./routes/auth.routes.js";
// import projectRoutes from "./routes/project.routes.js";
// import healthRoutes from "./routes/health.routes.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // test route (keep it for sanity)
// app.get("/", (req, res) => {
//   res.send("SERVER IS ALIVE");
// });

// app.use("/api/health", healthRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);

// const PORT = process.env.PORT || 5000;

// // app.listen(PORT, async () => {
// //   await pool.query("SELECT 1");
// //   console.log(`Server running on port ${PORT}`);
// // });

// app.listen(PORT, async () => {
//   try {
//     await pool.query("SELECT 1");
//     console.log("Database connected");

//     // await runSeeds();  
//     console.log(`Server running on port ${PORT}`);
//   } catch (err) {
//     console.error("Startup error:", err.message);
//   }
// });

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import pool from "./config/db.js";

// import authRoutes from "./routes/auth.routes.js";
// import projectRoutes from "./routes/project.routes.js";
// import healthRoutes from "./routes/health.routes.js";
// import { runMigrations } from "../migrations/runMigrations.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/health", healthRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);

// const PORT = process.env.PORT || 5000;

// async function startServer() {
//   try {
//     // wait for DB
//     await pool.query("SELECT 1");
//     console.log(" Database connected");

//     //  RUN MIGRATIONS FIRST
//     await runMigrations();

//     app.listen(PORT, () => {
//       console.log(` Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error(" Startup error:", err.message);
//     process.exit(1);
//   }
// }

// startServer();

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// import { waitForDb } from "./utils/waitForDb.js";
// // import { runMigrations } from "../migrations/runMigrations.js";
// // import { runSeeds } from "../seeds/runSeeds.js";
// import { runMigrations } from "../migrations/runMigrations.js";
// import { runSeeds } from "../seeds/runSeeds.js";

// import authRoutes from "./routes/auth.routes.js";
// import projectRoutes from "./routes/project.routes.js";
// import healthRoutes from "./routes/health.routes.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/health", healthRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);

// const PORT = process.env.PORT || 5000;

// (async () => {
//   try {
//     await waitForDb();        
//     await runMigrations();    
//     await runSeeds();         

//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error("Startup error:", err.message);
//     process.exit(1);
//   }
// })();

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import pool from "./config/db.js";

// import authRoutes from "./routes/auth.routes.js";
// import projectRoutes from "./routes/project.routes.js";
// import healthRoutes from "./routes/health.routes.js";

// import { runMigrations } from "../migrations/runMigrations.js";
// import { runSeeds } from "./utils/runSeeds.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("SERVER IS ALIVE");
// });

// app.use("/api/health", healthRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, async () => {
//   try {
//     console.log("Connecting to database...");
//     await pool.query("SELECT 1");
//     console.log(" Database connected");

//     await runMigrations();
//     await runSeeds();

//     console.log(` Server running on port ${PORT}`);
//   } catch (err) {
//     console.error(" Startup error:", err.message);
//     process.exit(1);
//   }
// });

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import healthRoutes from "./routes/health.routes.js";

import { runMigrations } from "../migrations/runMigrations.js";
import { runSeeds } from "./utils/runSeeds.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVER IS ALIVE");
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await pool.query("SELECT 1");
    console.log("Database connected");

    await runMigrations();
    await runSeeds();

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

startServer();
