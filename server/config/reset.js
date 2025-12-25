// server/config/reset.js
// ----------------------
// Reset script for the OnTheFly database
// Drops existing tables, recreates them in proper dependency order,
// and seeds the trips table with initial data.
// ⚠️ Never run in production — this will delete all data.

import "../config/dotenv.js"; // Load environment variables first
import { pool } from "./database.js"; // Postgres connection pool
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the trip seed data from JSON
const tripsFilePath = path.join(__dirname, "data/data.json");
const tripsData = JSON.parse(fs.readFileSync(tripsFilePath, "utf-8"));

/* 
  🧹 Drop all existing tables
  🔹 Cleans up old tables before recreating them for development
  ⚠️ Never run in production
*/
const dropTables = async () => {
  const dropQuery = `
    DROP TABLE IF EXISTS 
      trips_users,
      trips_destinations,
      activities,
      destinations,
      trips,
      users
    CASCADE;
  `;
  try {
    await pool.query(dropQuery);
    console.log("🧹 All existing tables dropped successfully");
  } catch (err) {
    console.error("⚠️ Error dropping tables", err);
  }
};

/* 
  1️⃣ Create users table
*/
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      githubid INTEGER NOT NULL,
      username VARCHAR(100) NOT NULL,
      avatarurl VARCHAR(500) NOT NULL,
      accesstoken VARCHAR(500) NOT NULL
    );
  `;
  try {
    await pool.query(query);
    console.log("🎉 Users table created successfully");
  } catch (err) {
    console.error("⚠️ Error creating users table", err);
  }
};

/* 
  2️⃣ Create trips table
*/
const createTripsTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS trips (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description VARCHAR(500) NOT NULL,
      img_url TEXT NOT NULL,
      num_days INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      total_cost NUMERIC(10, 2) NOT NULL
    );
  `;
  try {
    await pool.query(query);
    console.log("🎉 Trips table created successfully");
  } catch (err) {
    console.error("⚠️ Error creating trips table", err);
  }
};

/* 
  3️⃣ Create destinations table
*/
const createDestinationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS destinations (
      id SERIAL PRIMARY KEY,
      destination VARCHAR(100) NOT NULL,
      description VARCHAR(500) NOT NULL,
      city VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL,
      img_url TEXT NOT NULL,
      flag_img_url TEXT NOT NULL
    );
  `;
  try {
    await pool.query(query);
    console.log("🎉 Destinations table created successfully");
  } catch (err) {
    console.error("⚠️ Error creating destinations table", err);
  }
};

/* 
  4️⃣ Create activities table
*/
const createActivitiesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      trip_id INT NOT NULL,
      activity VARCHAR(100) NOT NULL,
      num_votes INTEGER DEFAULT 0,
      FOREIGN KEY (trip_id) REFERENCES trips(id)
    );
  `;
  try {
    await pool.query(query);
    console.log("🎉 Activities table created successfully");
  } catch (err) {
    console.error("⚠️ Error creating activities table", err);
  }
};

/* 
  5️⃣ Create trips_destinations join table
*/
const createTripsDestinationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS trips_destinations (
      trip_id INT NOT NULL,
      destination_id INT NOT NULL,
      PRIMARY KEY (trip_id, destination_id),
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
      FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
    );
  `;
  try {
    await pool.query(query);
    console.log("🎉 Trips_Destinations table created successfully");
  } catch (err) {
    console.error("⚠️ Error creating trips_destinations table", err);
  }
};

/* 
  6️⃣ Create trips_users join table
*/
const createTripsUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS trips_users (
      trip_id INT NOT NULL,
      user_id INT NOT NULL,
      PRIMARY KEY (trip_id, user_id),
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
    );
  `;
  try {
    await pool.query(query);
    console.log("🎉 Trips_Users table created successfully");
  } catch (err) {
    console.error("⚠️ Error creating trips_users table", err);
  }
};

/* 
  7️⃣ Seed trips table
  🔹 Populates initial trips data after the table has been created
*/
const seedTripsTable = async () => {
  try {
    for (const trip of tripsData) {
      const insertQuery = `
     INSERT INTO trips
          (title, description, img_url, num_days, start_date, end_date, total_cost)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;
      const values = [
        trip.title,
        trip.description,
        trip.img_url,
        trip.num_days,
        trip.start_date,
        trip.end_date,
        trip.total_cost,
      ];
      await pool.query(insertQuery, values);
      console.log(`✅ ${trip.title} added successfully`);
    }
    console.log("🎉 Trips table seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding trips table:", err);
  }
};

/* 
  🚀 Main function to reset database
  🔹 Drops tables, recreates all tables in proper order, and seeds initial data
*/
const resetDatabase = async () => {
  console.log("⏳ Resetting database...");

  await dropTables();

  // Create tables in dependency order
  await createUsersTable();
  await createTripsTable();
  await createDestinationsTable();
  await createActivitiesTable();
  await createTripsDestinationsTable();
  await createTripsUsersTable();

  console.log("✅ All tables created successfully!");

  // Seed trips table
  await seedTripsTable();

  // Close database connection
  await pool.end();
  console.log("🏁 Database reset complete!");
};

// Run the reset
resetDatabase();

// // config/reset.js
// import "../config/dotenv.js"; // Load environment variables first
// import { pool } from "./database.js";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load the trip data
// const tripsFilePath = path.join(__dirname, "../config/data/data.json");
// const tripsData = JSON.parse(fs.readFileSync(tripsFilePath, "utf-8"));
// // users → trips → destinations → activities → trips_destinations → trips_users

// /*
//   🧹 Clean up old tables before recreating them
//   🔹 Drops existing tables for a clean development reset; ⚠️ never use in production as it will delete all data

// */
// const dropTables = async () => {
//   const dropQuery = `
//     DROP TABLE IF EXISTS
//       trips_users,
//       trips_destinations,
//       activities,
//       destinations,
//       trips,
//       users
//     CASCADE;
//   `;
//   try {
//     await pool.query(dropQuery);
//     console.log("🧹 All existing tables dropped successfully");
//   } catch (err) {
//     console.error("⚠️ error dropping tables", err);
//   }
// };

// /*
//   1️⃣ Create users table
// */
// const createUsersTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       githubid INTEGER NOT NULL,
//       username VARCHAR(100) NOT NULL,
//       avatarurl VARCHAR(500) NOT NULL,
//       accesstoken VARCHAR(500) NOT NULL
//     );
//   `;
//   try {
//     await pool.query(query);
//     console.log("🎉 users table created successfully");
//   } catch (err) {
//     console.error("⚠️ error creating users table", err);
//   }
// };

// /*
//   2️⃣ Create trips table
// */
// const createTripsTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS trips (
//       id SERIAL PRIMARY KEY,
//       tripname VARCHAR(100) NOT NULL,
//       start_date DATE,
//       end_date DATE
//     );
//   `;
//   try {
//     await pool.query(query);
//     console.log("🎉 trips table created successfully");
//   } catch (err) {
//     console.error("⚠️ error creating trips table", err);
//   }
// };

// /*
//   3️⃣ Create destinations table
// */
// const createDestinationsTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS destinations (
//       id SERIAL PRIMARY KEY,
//       destination VARCHAR(100) NOT NULL,
//       description VARCHAR(500) NOT NULL,
//       city VARCHAR(100) NOT NULL,
//       country VARCHAR(100) NOT NULL,
//       img_url TEXT NOT NULL,
//       flag_img_url TEXT NOT NULL
//     );
//   `;
//   try {
//     await pool.query(query);
//     console.log("🎉 destinations table created successfully");
//   } catch (err) {
//     console.error("⚠️ error creating destinations table", err);
//   }
// };

// /*
//   4️⃣ Create activities table
// */
// const createActivitiesTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS activities (
//       id SERIAL PRIMARY KEY,
//       trip_id INT NOT NULL,
//       activity VARCHAR(100) NOT NULL,
//       num_votes INTEGER DEFAULT 0,
//       FOREIGN KEY (trip_id) REFERENCES trips(id)
//     );
//   `;
//   try {
//     await pool.query(query);
//     console.log("🎉 activities table created successfully");
//   } catch (err) {
//     console.error("⚠️ error creating activities table", err);
//   }
// };

// /*
//   5️⃣ Create trips_destinations table
// */
// const createTripsDestinationsTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS trips_destinations (
//       trip_id INT NOT NULL,
//       destination_id INT NOT NULL,
//       PRIMARY KEY (trip_id, destination_id),
//       FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
//       FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
//     );
//   `;
//   try {
//     await pool.query(query);
//     console.log("🎉 trips_destinations table created successfully");
//   } catch (err) {
//     console.error("⚠️ error creating trips_destinations table", err);
//   }
// };

// /*
//   6️⃣ Create trips_users table
// */
// const createTripsUsersTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS trips_users (
//       trip_id INT NOT NULL,
//       user_id INT NOT NULL,
//       PRIMARY KEY (trip_id, user_id),
//       FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
//       FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
//     );
//   `;
//   try {
//     await pool.query(query);
//     console.log("🎉 trips_users table created successfully");
//   } catch (err) {
//     console.error("⚠️ error creating trips_users table", err);
//   }
// };

// /*
//   🚀 Main function to reset database
// */
// const resetDatabase = async () => {
//   console.log("⏳ Resetting database and recreating all tables...");
//   await dropTables(); // drop existing tables
//   await createUsersTable();
//   await createTripsTable();
//   await createDestinationsTable();
//   await createActivitiesTable();
//   await createTripsDestinationsTable();
//   await createTripsUsersTable();
//   console.log("✅ All tables created successfully!");
//   // ✅ Seed the trips table AFTER creation
//   await seedTripsTable();
//   await pool.end();
// };

// resetDatabase();

// import "../config/dotenv.js"; // Load environment variables first
// import { pool } from "./database.js";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load the trip data
// const tripsFilePath = path.join(__dirname, "../config/data/data.json");
// const tripsData = JSON.parse(fs.readFileSync(tripsFilePath, "utf-8"));

// // -------------------------------------------------------------
// // 1️⃣ Create trips table
// // -------------------------------------------------------------
// const createTripsTable = async () => {
//   const query = `
//     DROP TABLE IF EXISTS trips;

//     CREATE TABLE IF NOT EXISTS trips (
//       id SERIAL PRIMARY KEY,
//       title VARCHAR(100) NOT NULL,
//       description VARCHAR(500) NOT NULL,
//       img_url TEXT NOT NULL,
//       num_days INTEGER NOT NULL,
//       start_date DATE NOT NULL,
//       end_date DATE NOT NULL,
//       total_cost NUMERIC(10, 2) NOT NULL
//     );
//   `;

//   try {
//     await pool.query(query);
//     console.log("✅ Trips table created successfully.");
//   } catch (err) {
//     console.error("❌ Error creating Trips table:", err);
//     throw err;
//   }
// };

// // -------------------------------------------------------------
// // 2️⃣ Seed trips table
// // -------------------------------------------------------------
// const seedTripsTable = async () => {
//   try {
//     await createTripsTable();

//     for (const trip of tripsData) {
//       const insertQuery = `
//         INSERT INTO trips
//           (title, description, img_url, num_days, start_date, end_date, total_cost)
//         VALUES ($1, $2, $3, $4, $5, $6, $7);
//       `;

// const values = [
//   trip.title,
//   trip.description,
//   trip.img_url,
//   trip.num_days,
//   trip.start_date,
//   trip.end_date,
//   trip.total_cost,
// ];

//       await pool.query(insertQuery, values);
//       console.log(`✅ ${trip.title} added successfully.`);
//     }

//     console.log("🎉 Trips table seeded successfully!");
//   } catch (err) {
//     console.error("❌ Seeding failed:", err);
//   } finally {
//     await pool.end();
//   }
// };

// // -------------------------------------------------------------
// // 3️⃣ Run seeding
// // -------------------------------------------------------------
// seedTripsTable();

// import { pool } from "./database.js";
// import "./dotenv.js";
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";
// import fs from "fs";

// const currentPath = fileURLToPath(import.meta.url);
// const tripsFile = fs.readFileSync(
//   path.join(dirname(currentPath), "../config/data/data.json")
// );
// const tripsData = JSON.parse(tripsFile);

// const createTripsTable = async () => {
//   const createTripsTableQuery = `
//       DROP TABLE IF EXISTS trips;

//       CREATE TABLE IF NOT EXISTS trips (
//           id serial PRIMARY KEY,
//           title varchar(100) NOT NULL,
//           description varchar(500) NOT NULL,
//           img_url text NOT NULL,
//           num_days integer NOT NULL,
//           start_date date NOT NULL,
//           end_date date NOT NULL,
//           total_cost money NOT NULL
//       );
//   `;
// };

// try {
//   const res = await pool.query(createTripsTable);
//   console.log("🎉 trips table created successfully");
// } catch (error) {
//   console.log("⚠️ error creating trips table", err);
// }

// const seedTripsTable = async () => {
//   await createTripsTable;
// };

// tripsData.forEach((trip) => {
//   const insertQuery = {
//     text: "INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)",
//   };
//   const values = [
//     trip.title,
//     trip.description,
//     trip.img_url,
//     trip.num_days,
//     trip.start_date,
//     trip.end_date,
//     trip.total_cost,
//   ];

//   pool.query(insertQuery, values, (err, res) => {
//     if (err) {
//       console.error("⚠️ error inserting trip", err);
//       return;
//     }

//     console.log(`✅ ${trip.title} added successfully`);
//   });
// });
