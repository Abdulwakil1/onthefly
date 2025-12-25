import express from "express";
import * as DestinationsController from "../controllers/destinations.js";

const router = express.Router();

/*
  Routes (mount this router at /api/destinations or similar):
  - GET    /           -> getDestinations
  - GET    /:id        -> getDestination
  - POST   /           -> createDestination
  - PATCH  /:id        -> updateDestination
  - DELETE /:id        -> deleteDestination
*/

// ✅ Test route
router.get("/test", (req, res) =>
  res.json({ message: "✅ Destinations route working properly!" })
);

// 1️⃣ Get all destinations
router.get("/", DestinationsController.getDestinations);

// 2️⃣ Get a single destination by ID
router.get("/:id", DestinationsController.getDestination);

// 3️⃣ Create a new destination
router.post("/", DestinationsController.createDestination);

// 4️⃣ Update an existing destination
router.patch("/:id", DestinationsController.updateDestination);
// 5️⃣ Delete a destination (specific ID)
router.delete("/:id", DestinationsController.deleteDestination);

// 6️⃣ Delete ALL destinations
router.delete("/", DestinationsController.deleteAllDestinations);

export default router;
