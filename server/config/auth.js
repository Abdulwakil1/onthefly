import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { pool } from "../config/database.js";

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://server-51fn.onrender.com"
    : "http://localhost:3001";

if (
  process.env.NODE_ENV === "production" &&
  (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET)
) {
  console.error("❌ Missing GitHub OAuth environment variables in production");
}

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${BACKEND_URL}/auth/github/callback`,
};

// const options = {
//   clientID: process.env.GITHUB_CLIENT_ID,
//   clientSecret: process.env.GITHUB_CLIENT_SECRET,
//   callbackURL: "http://localhost:3001/auth/github/callback",
// };

const verify = async (accessToken, refreshToken, profile, done) => {
  try {
    const { id: githubId, username: githubUsername, photos } = profile;

    // Normalize username once
    const username = githubUsername.trim().toLowerCase();
    const avatarUrl = photos?.[0]?.value || "";

    // 1️⃣ Look up user by GitHub ID (PRIMARY identity)
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE githubid = $1",
      [githubId]
    );

    if (existingUser.rows.length > 0) {
      // ✅ User already exists
      return done(null, existingUser.rows[0]);
    }

    // 2️⃣ Insert new user
    const insertResult = await pool.query(
      `
      INSERT INTO users (githubid, username, avatarurl, accesstoken)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [githubId, username, avatarUrl, accessToken]
    );

    return done(null, insertResult.rows[0]);
  } catch (error) {
    console.error("❌ GitHub auth error:", error.message);
    return done(error);
  }
};

// Register strategy
passport.use(new GitHubStrategy(options, verify));

// Session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

export default passport;
