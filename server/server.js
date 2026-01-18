// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import tripRoutes from "./routes/trips.js";
import activityRoutes from "./routes/activities.js";
import destinationRoutes from "./routes/destinations.js";
import tripsDestinationsRoutes from "./routes/tripsDestinations.js";
import authRoutes from "./routes/auth.js";
import userTripRoutes from "./routes/users-trips.js";

import "./config/auth.js";

const app = express();
app.use(express.json());

// 🔹 Client URL
const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? "https://client-23t0.onrender.com"
    : "http://localhost:5173";

// 🔹 CORS
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// 🔹 Required for Render
app.set("trust proxy", 1);

// 🔹 Session
// app.use(
//   session({
//     name: "onthefly.sid",
//     secret: process.env.SESSION_SECRET || "codepath",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     },
//   })
// );

app.use(
  session({
    name: "onthefly.sid",
    secret: process.env.SESSION_SECRET || "codepath",
    resave: false,
    saveUninitialized: false,
    proxy: true, // 🔥 REQUIRED
    cookie: {
      httpOnly: true,
      secure: true, // REQUIRED for SameSite=None
      sameSite: "none", // REQUIRED for cross-site OAuth
      domain: ".onrender.com", // 🔥 CRITICAL FIX
    },
  })
);

// 🔹 Passport
app.use(passport.initialize());
app.use(passport.session());

// 🔹 Test route
app.get("/test", (req, res) => res.send("Server is working"));

// 🔹 Auth & API routes
app.use("/auth", authRoutes);
app.use("/api/users-trips", userTripRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips_destinations", tripsDestinationsRoutes);

// 🔹 Root
app.get("/", (req, res) => {
  res.status(200).send("<h1>✈️ On the Fly API</h1>");
});

// 🔹 Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
