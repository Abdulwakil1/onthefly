import { pool } from "../config/database.js";

export const getDestinations = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM destinations ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching destinations:", err);
    res.status(500).send("Server error while fetching destinations");
  }
};

//
// 2️⃣ Retrieve a single destination by ID
//
export const getDestination = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      "SELECT * FROM destinations WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Destination not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching destination:", err);
    res.status(500).send("Server error while fetching destination");
  }
};

//
// 3️⃣ Create a new destination
//
export const createDestination = async (req, res) => {
  const { destination, description, city, country, img_url, flag_img_url } =
    req.body;
  // ✅ Input validation (check for missing fields)
  if (
    !destination ||
    !description ||
    !city ||
    !country ||
    !img_url ||
    !flag_img_url
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO destinations (destination, description, city, country, img_url, flag_img_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [destination, description, city, country, img_url, flag_img_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating destination:", err);
    res.status(500).send("Server error while creating destination");
  }
};

//
// 4️⃣ Update a destination
//
export const updateDestination = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { destination, description, city, country, img_url, flag_img_url } =
    req.body;

  try {
    const result = await pool.query(
      `
      UPDATE destinations
      SET destination = $1, description = $2, city = $3, country = $4, img_url = $5, flag_img_url = $6
      WHERE id = $7
      RETURNING *;
      `,
      [destination, description, city, country, img_url, flag_img_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Destination not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating destination:", err);
    res.status(500).send("Server error while updating destination");
  }
};

//
// 5️⃣ Delete a destination
//
export const deleteDestination = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      "DELETE FROM destinations WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Destination not found");
    }

    res.status(200).send(`Destination with ID ${id} deleted successfully`);
  } catch (err) {
    console.error("Error deleting destination:", err);
    res.status(500).send("Server error while deleting destination");
  }
};
//
// 6️⃣ Delete ALL destinations
//
export const deleteAllDestinations = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM destinations RETURNING *;");

    if (result.rowCount === 0) {
      return res.status(200).send("No destinations to delete.");
    }

    res.status(200).json({
      message: "All destinations deleted successfully",
      deletedCount: result.rowCount,
    });
  } catch (err) {
    console.error("Error deleting all destinations:", err);
    res.status(500).send("Server error while deleting all destinations");
  }
};
