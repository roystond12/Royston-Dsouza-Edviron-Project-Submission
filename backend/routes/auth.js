// backend/routes/auth.js
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const SECRET_KEY = "your-secret-key";

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Dummy user check - replace with DB
  if (username === "admin" && password === "password") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ message: "Login successful", token, user: { username } });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
