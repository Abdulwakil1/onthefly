// routes/users-trips.js

import express from "express";
import {
  createTripUser,
  getTripUsers,
  getUserTrips,
} from "../controllers/users-trips.js";

const router = express.Router();

// POST /users-trips/create/:trip_id
router.post("/create/:trip_id", createTripUser);

// GET /users-trips/users/:trip_id
router.get("/users/:trip_id", getTripUsers);

// GET /users-trips/trips/:username
// router.get("/trips/:username", getUserTrips);

// GET /users-trips/trips/:user_id
router.get("/trips/:user_id", getUserTrips);

export default router;
