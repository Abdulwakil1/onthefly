import express from "express";
import passport from "passport";

const router = express.Router();
const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? "https://client-23t0.onrender.com"
    : "http://localhost:5173";

// ✅ Login success route
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: "No user logged in" });
  }
});

// ✅ Login failed route
router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: false, message: "failure" });
});

// ✅ Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid"); // Clear session cookie
      res.json({ status: "logout", user: {} });
    });
  });
});

// ✅ GitHub login route
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user"], // Only read public profile info
    // prompt: "consent", // 🔥 forces GitHub to ask again
  })
);

// ✅ GitHub callback route
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: `${CLIENT_URL}/destinations`,
  })
);

export default router;
