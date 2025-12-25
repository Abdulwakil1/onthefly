// routes/tripsDestinations.js
import express from "express";
import * as TripsDestinationsController from "../controllers/tripsDestinations.js";

const router = express.Router();

/*
  Routes (mount this router at /api/trips_destinations):
  - GET    /                       -> getTripsDestinations
  - GET    /trips/:destination_id  -> getAllTrips
  - GET    /destinations/:trip_id  -> getAllDestinations
  - POST   /                       -> createTripDestination
*/

// ✅ Test route
router.get("/test", (req, res) =>
  res.json({ message: "✅ Trips–Destinations route working properly!" })
);

// 1️⃣ Get all trip–destination relationships
router.get("/", TripsDestinationsController.getTripsDestinations);

// 2️⃣ Get all trips for a specific destination
router.get("/trips/:destination_id", TripsDestinationsController.getAllTrips);

// 3️⃣ Get all destinations for a specific trip
router.get(
  "/destinations/:trip_id",
  TripsDestinationsController.getAllDestinations
);

// 4️⃣ Add a new trip–destination link
router.post("/", TripsDestinationsController.createTripDestination);

// 5️⃣ Delete a specific trip–destination relationship
router.delete(
  "/:trip_id/:destination_id",
  TripsDestinationsController.deleteTripDestination
);

// 6️⃣ Delete ALL trip–destination relationships
router.delete("/", TripsDestinationsController.deleteAllTripDestinations);

export default router;
