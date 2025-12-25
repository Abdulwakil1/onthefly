// dotenv.js
// ----------------------------
// Loads environment variables safely and consistently across the app.

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname manually for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate the .env file at the project root (one level up from /config)
const envPath = path.resolve(__dirname, "../.env");

// Load environment variables from the resolved .env path
dotenv.config({ path: envPath });

// Optional: Log confirmation (remove or comment out in production)
console.log(`✅ Environment variables loaded from: ${envPath}`);

// import dotenv from "dotenv";
// dotenv.config({ path: "../.evn" });
