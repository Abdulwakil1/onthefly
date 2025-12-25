// database.js
// ----------------------------
// This file sets up a secure and reusable Postgres connection pool.
// It loads environment variables from .env and exports the pool for queries.

import pg from "pg";
import "./dotenv.js";

const { Pool } = pg;

// Connection configuration
const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Create and export the connection pool
export const pool = new Pool(config);

// ----------------------------
// Optional: Helpful event listeners (recommended for debugging)
// ----------------------------

pool.on("connect", () => {
  console.log("✅ Connected to Postgres database successfully.");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on Postgres client:", err);
  process.exit(-1);
});
