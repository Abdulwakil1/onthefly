// routes/trips.js
import express from "express";
import * as TripsController from "../controllers/trips.js";

const router = express.Router();
/*
  ============================================
  🧭 Trips Routes
  --------------------------------------------
  Routes handle all trip-related API endpoints.
  Following the same conventions as Project 4
  and Lab 5 route structures.
  ============================================
*/

// ✅ Test route
router.get("/test", (req, res) => {
  res.json({ message: "✅ Trips route working properly!" });
});

// 🗂️ Get all trips
router.get("/", TripsController.getTrips);

// 🔍 Get a single trip by ID
router.get("/:id", TripsController.getTrip);

// ➕ Create a new trip
router.post("/", TripsController.createTrip);

// ✏️ Update an existing trip
router.patch("/:id", TripsController.updateTrip);

// 🗑️ Delete a trip
router.delete("/:id", TripsController.deleteTrip);

export default router;
