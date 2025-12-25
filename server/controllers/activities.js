// server/controllers/activities.js
// Controller functions for activities table

import { pool } from "../config/database.js"; // adjust path if your database file is elsewhere

/*
  1️⃣ Get all activities
  2️⃣ Get activities for a specific trip (by trip_id)
  3️⃣ Create a new activity for a trip
  4️⃣ Update activity likes (num_votes)
  5️⃣ Delete a single activity
*/

// 1️⃣ Retrieve all activities
export const getActivities = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM activities
      ORDER BY id ASC;
    `;
    const { rows } = await pool.query(query);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching activities:", error.message);
    return res.status(500).json({ error: "Failed to fetch activities." });
  }
};

// 2️⃣ Retrieve activities for a specific trip
export const getTripActivities = async (req, res) => {
  try {
    const tripId = parseInt(req.params.trip_id, 10);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: "Invalid trip_id parameter." });
    }

    const query = `
      SELECT *
      FROM activities
      WHERE trip_id = $1
      ORDER BY id ASC;
    `;
    const { rows } = await pool.query(query, [tripId]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching activities for trip:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch activities for trip." });
  }
};

// 3️⃣ Create a new activity for a trip
export const createActivity = async (req, res) => {
  try {
    const tripId = parseInt(req.params.trip_id, 10);
    const { activity } = req.body;

    if (isNaN(tripId)) {
      return res.status(400).json({ error: "Invalid trip_id parameter." });
    }
    if (!activity || typeof activity !== "string") {
      return res.status(400).json({ error: "Activity text is required." });
    }

    const insertQuery = `
      INSERT INTO activities (trip_id, activity, num_votes)
      VALUES ($1, $2, 0)
      RETURNING *;
    `;
    const values = [tripId, activity];
    const { rows } = await pool.query(insertQuery, values);

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating activity:", error.message);
    return res.status(500).json({ error: "Failed to create activity." });
  }
};

// 4️⃣ Update number of likes for an activity
// This endpoint expects a JSON body like: { "num_votes": 5 } or you can implement increment logic
export const updateActivityLikes = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Prefer explicit value in body, but we can also support incrementing by 1 if desired.
    const { num_votes, increment } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid activity id parameter." });
    }

    if (typeof num_votes === "number") {
      // Set explicit value
      const query = `
        UPDATE activities
        SET num_votes = $1
        WHERE id = $2
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [num_votes, id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Activity not found." });
      }
      return res.status(200).json(rows[0]);
    }

    if (increment === true) {
      // Increment by 1 (safe single-statement update)
      const query = `
        UPDATE activities
        SET num_votes = num_votes + 1
        WHERE id = $1
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Activity not found." });
      }
      return res.status(200).json(rows[0]);
    }

    // If neither provided:
    return res
      .status(400)
      .json({
        error:
          "Provide num_votes (number) or { increment: true } in request body.",
      });
  } catch (error) {
    console.error("Error updating activity likes:", error.message);
    return res.status(500).json({ error: "Failed to update activity likes." });
  }
};

// 5️⃣ Delete a single activity
export const deleteActivity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid activity id parameter." });
    }

    const { rowCount } = await pool.query(
      "DELETE FROM activities WHERE id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Activity not found." });
    }

    return res.status(200).json({ message: "Activity deleted successfully." });
  } catch (error) {
    console.error("Error deleting activity:", error.message);
    return res.status(500).json({ error: "Failed to delete activity." });
  }
};
