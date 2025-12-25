import { pool } from "../config/database.js";
// Add a user to a trip
export const createTripUser = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id);
    const { username } = req.body; // receive username

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }

    // 1. Get the user_id from the username
    const userResult = await pool.query(
      "SELECT id, username FROM users WHERE username = $1",
      [username.trim()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id: user_id, username: canonicalUsername } = userResult.rows[0];

    // 2. Insert trip-user association
    await pool.query(
      `INSERT INTO trips_users (trip_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [trip_id, user_id]
    );

    // 3️⃣ Return what frontend actually needs
    res.status(200).json({
      user_id,
      username: canonicalUsername,
    });
    console.log(`🆕 Added user ${canonicalUsername} to trip ${trip_id}`);
  } catch (error) {
    console.log("Error adding user to trip:", error.message);

    // duplicate composite key protection
    if (error.code === "23505") {
      return res.status(409).json({ error: "User already added to this trip" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users for a specific trip
export const getTripUsers = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id);

    // Join trips_users with users to get user info
    const results = await pool.query(
      `SELECT u.id, u.githubid, u.username, u.avatarurl
       FROM trips_users tu
       JOIN users u ON tu.user_id = u.id
       WHERE tu.trip_id = $1`,
      [trip_id]
    );

    res.status(200).json(results.rows);
    console.log(`✅ Retrieved users for trip ${trip_id}`);
  } catch (error) {
    res.status(409).json({ error: error.message });
    console.log("🚫 Unable to get users for trip:", error.message);
  }
};

// Get all trips a specific user is associated with
export const getUserTrips = async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);

    // Join trips_users with trips to get trip info
    const results = await pool.query(
      `SELECT t.*
       FROM trips_users tu
       JOIN trips t ON tu.trip_id = t.id
       WHERE tu.user_id = $1`,
      [user_id]
    );

    res.status(200).json(results.rows);
    console.log(`✅ Retrieved trips for user ${user_id}`);
  } catch (error) {
    res.status(409).json({ error: error.message });
    console.log("🚫 Unable to get trips for user:", error.message);
  }
};
