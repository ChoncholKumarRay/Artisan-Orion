const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new user
    const newUser = new User({
      username,
      password,
      bank_account: "", // Empty by default
      secret_key: "",   // Empty by default
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

module.exports = router;
