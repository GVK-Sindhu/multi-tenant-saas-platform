import app from './app.js';
import { runMigrations } from './utils/runMigrations.js';
import { runSeeds } from './utils/runSeeds.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await runMigrations();
    await runSeeds();

    app.listen(PORT, () => {
      console.log(` Backend server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(' Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
