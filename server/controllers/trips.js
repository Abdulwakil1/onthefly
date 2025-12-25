// controllers/trips.js

import { pool } from "../config/database.js";

/*
  ============================================
  🌍 Trips Controller
  --------------------------------------------
  Handles CRUD operations for the trips table.
  Follows best practices for consistency, 
  error handling, and response clarity.
  ============================================
*/

// 1️⃣ Get all trips
export const getTrips = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM trips ORDER BY id ASC");
    res.status(200).json(results.rows);
  } catch (error) {
    console.error("Error fetching trips:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 2️⃣ Get a trip by ID
export const getTrip = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid trip ID parameter." });
    }

    const results = await pool.query("SELECT * FROM trips WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Trip not found." });
    }

    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error("Error fetching trip:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 3️⃣ Create a new trip + auto-add creator as traveler
export const createTrip = async (req, res) => {
  try {
    const {
      title,
      description,
      img_url,
      num_days,
      start_date,
      end_date,
      total_cost,
      username, // 👈 NEW
    } = req.body;

    // Basic validation
    if (
      !title ||
      !description ||
      !img_url ||
      !num_days ||
      !start_date ||
      !end_date ||
      !total_cost ||
      !username // 👈 ensure creator exists
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // 1️⃣ Create the trip
    const insertTripQuery = `
      INSERT INTO trips
      (title, description, img_url, num_days, start_date, end_date, total_cost)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const tripValues = [
      title,
      description,
      img_url,
      num_days,
      start_date,
      end_date,
      total_cost,
    ];

    const tripResult = await pool.query(insertTripQuery, tripValues);
    const trip = tripResult.rows[0];

    // 2️⃣ Find user_id from username
    const userResult = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user_id = userResult.rows[0].id;

    // 3️⃣ Add creator to trips_users
    await pool.query(
      `INSERT INTO trips_users (trip_id, user_id)
       VALUES ($1, $2)`,
      [trip.id, user_id]
    );

    // 4️⃣ Return trip as before
    res.status(201).json(trip);
  } catch (error) {
    console.error("Error creating trip:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 4️⃣ Update a trip
export const updateTrip = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title,
      description,
      img_url,
      num_days,
      start_date,
      end_date,
      total_cost,
    } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid trip ID parameter." });
    }

    const updateQuery = `
      UPDATE trips
      SET title = $1, description = $2, img_url = $3, num_days = $4, 
          start_date = $5, end_date = $6, total_cost = $7
      WHERE id = $8
      RETURNING *;
    `;

    const values = [
      title,
      description,
      img_url,
      num_days,
      start_date,
      end_date,
      total_cost,
      id,
    ];
    const results = await pool.query(updateQuery, values);

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Trip not found." });
    }

    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error("Error updating trip:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 5️⃣ Delete a trip (and related data)
export const deleteTrip = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid trip ID parameter." });
    }

    // 1️⃣ Delete related activities
    await pool.query("DELETE FROM activities WHERE trip_id = $1", [id]);

    // 2️⃣ Remove users from trip
    await pool.query("DELETE FROM trips_users WHERE trip_id = $1", [id]);

    // 3️⃣ Remove destinations from trip
    await pool.query("DELETE FROM trips_destinations WHERE trip_id = $1", [id]);

    // 4️⃣ Delete the trip itself
    const { rowCount } = await pool.query("DELETE FROM trips WHERE id = $1", [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Trip not found." });
    }

    res.status(200).json({
      message: "Trip and related data deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting trip:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export default {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
};
