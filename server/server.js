// server.js
import "dotenv/config"; // <-- ADD THIS FIRST
import express from "express";
import cors from "cors";
import tripRoutes from "./routes/trips.js";
import activityRoutes from "./routes/activities.js";
import destinationRoutes from "./routes/destinations.js";
import tripsDestinationsRoutes from "./routes/tripsDestinations.js";

import passport from "passport";
import session from "express-session";
// import { GitHub } from "./config/auth.js";
import "./config/auth.js";
import authRoutes from "./routes/auth.js";
import userTripRoutes from "./routes/users-trips.js";

// create express app
const app = express();
app.use(express.json());
// app.use(cors());

// --- CORS MIDDLEWARE ---
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

// --- SESSION MIDDLEWARE ---
app.use(
  session({
    secret: "codepath",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // must be false for localhost HTTP
    },
  })
);

// --- PASSPORT MIDDLEWARE/INITIALIZATION ---
app.use(passport.initialize());
app.use(passport.session()); // REQUIRED for sessions
app.get("/test", (req, res) => res.send("Server is working"));
app.use("/auth", authRoutes); // mount it at /auth
app.use("/api/users-trips", userTripRoutes);

// Serialize & deserialize user
// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));
// passport.serializeUser((user, done) => done(null, user.id)); // for production, use only user ID

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; margin-top: 50px;">✈️ On the Fly API</h1>'
    );
});

// ✅ Routes
app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips_destinations", tripsDestinationsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
