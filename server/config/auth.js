import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { pool } from "../config/database.js";

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/github/callback",
};

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

// import passport from "passport";
// import { Strategy as GitHubStrategy } from "passport-github2";
// import { pool } from "../config/database.js";

// const options = {
//   clientID: process.env.GITHUB_CLIENT_ID,
//   clientSecret: process.env.GITHUB_CLIENT_SECRET,
//   callbackURL: "http://localhost:3001/auth/github/callback",
// };

// const verify = async (accessToken, refreshToken, profile, callback) => {
//   try {
//     // Extract user info from GitHub profile
//     const {
//       _json: { id, login, avatar_url },
//     } = profile;

//     const userData = {
//       githubId: id,
//       username: login,
//       avatarUrl: avatar_url,
//       accessToken: accessToken || null,
//     };

//     // Check if user already exists
//     const results = await pool.query(
//       "SELECT * FROM users WHERE username = $1",
//       //   [userData.username]
//       [userData.githubId]
//     );

//     let user = results.rows[0];

//     // If user doesn't exist → insert into users table
//     if (!user) {
//       const insertResults = await pool.query(
//         `INSERT INTO users (githubid, username, avatarurl, accesstoken)
//          VALUES ($1, $2, $3, $4)
//          RETURNING *`,
//         [
//           userData.githubId,
//           userData.username,
//           userData.avatarUrl,
//           userData.accessToken,
//         ]
//       );

//       user = insertResults.rows[0];
//     }

//     // Complete login
//     return callback(null, user);
//   } catch (error) {
//     console.error("Error verifying GitHub user:", error);
//     return callback(error);
//   }
// };

// // Register the GitHub strategy
// passport.use(new GitHubStrategy(options, verify));

// // For session support
// passport.serializeUser((user, done) => {
//   done(null, user.id); // only store user.id in cookie
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const results = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
//     done(null, results.rows[0]);
//   } catch (err) {
//     done(err);
//   }
// });

// export default passport;
