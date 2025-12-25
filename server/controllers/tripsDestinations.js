// controllers/tripsDestinations.js
import { pool } from "../config/database.js";

//
// 1️⃣ Retrieve all trip–destination relationships
//
export const getTripsDestinations = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trips_destinations");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching trips_destinations:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching trips_destinations" });
  }
};

//
// 2️⃣ Retrieve all trips for a specific destination
//
export const getAllTrips = async (req, res) => {
  const destination_id = parseInt(req.params.destination_id, 10);
  if (isNaN(destination_id)) {
    return res.status(400).json({ error: "Invalid destination ID" });
  }

  try {
    const result = await pool.query(
      `
      SELECT t.*
      FROM trips t
      JOIN trips_destinations td ON t.id = td.trip_id
      WHERE td.destination_id = $1;
      `,
      [destination_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching trips for destination:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching trips for destination" });
  }
};

//
// 3️⃣ Retrieve all destinations for a specific trip
//
export const getAllDestinations = async (req, res) => {
  const trip_id = parseInt(req.params.trip_id, 10);
  if (isNaN(trip_id)) {
    return res.status(400).json({ error: "Invalid trip ID" });
  }

  try {
    const result = await pool.query(
      `
      SELECT d.*
      FROM destinations d
      JOIN trips_destinations td ON d.id = td.destination_id
      WHERE td.trip_id = $1;
      `,
      [trip_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching destinations for trip:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching destinations for trip" });
  }
};

//
// 4️⃣ Insert a new trip–destination relationship
//

export const createTripDestination = async (req, res) => {
  console.log("Received body:", req.body); // ← ADD THIS
  const { trip_id, destination_id } = req.body;
  console.log("Trip:", trip_id, "Destination:", destination_id);

  // 1️⃣ Simple input validation (outside try)
  if (!trip_id || !destination_id) {
    return res.status(400).json({
      error: "Both trip_id and destination_id are required.",
    });
  }

  try {
    // 2️⃣ Check for duplicate
    const existing = await pool.query(
      "SELECT * FROM trips_destinations WHERE trip_id = $1 AND destination_id = $2",
      [trip_id, destination_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: "This trip–destination link already exists.",
      });
    }

    // 3️⃣ Create new record
    const result = await pool.query(
      `
      INSERT INTO trips_destinations (trip_id, destination_id)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [trip_id, destination_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating trip–destination link:", error);
    res.status(500).json({
      error: "Server error while creating trip–destination link.",
    });
  }
};

export const deleteTripDestination = async (req, res) => {
  const { trip_id, destination_id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM trips_destinations
      WHERE trip_id = $1 AND destination_id = $2
      RETURNING *;
      `,
      [trip_id, destination_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Trip–destination link not found.",
      });
    }

    res.status(200).json({
      message: "Trip–destination link deleted successfully.",
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting trip–destination link:", err);
    res.status(500).json({
      error: "Server error while deleting trip–destination link.",
    });
  }
};

export const deleteAllTripDestinations = async (req, res) => {
  try {
    await pool.query("DELETE FROM trips_destinations");

    res.status(200).json({
      message: "All trip–destination links deleted successfully.",
    });
  } catch (err) {
    console.error("Error clearing trips_destinations:", err);
    res.status(500).json({
      error: "Server error while clearing trips_destinations.",
    });
  }
};
