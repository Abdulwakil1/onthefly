// server/routes/activities.js
import express from "express";
import * as ActivitiesController from "../controllers/activities.js";

const router = express.Router();

/*
  Routes (mount this router at /api/activities or similar):
  - GET    /           -> getActivities
  - GET    /:trip_id   -> getTripActivities
  - POST   /:trip_id   -> createActivity
  - PATCH  /:id        -> updateActivityLikes
  - DELETE /:id        -> deleteActivity
*/

// Test route
router.get("/test", (req, res) =>
  res.json({ message: "✅ Activities route working properly!" })
);

// Get all activities
router.get("/", ActivitiesController.getActivities);

// Get activities for a specific trip (trip_id)
router.get("/:trip_id", ActivitiesController.getTripActivities);

// Create a new activity for a trip
router.post("/:trip_id", ActivitiesController.createActivity);

// Update likes for an activity
router.patch("/:id", ActivitiesController.updateActivityLikes);

// Delete an activity
router.delete("/:id", ActivitiesController.deleteActivity);

export default router;
