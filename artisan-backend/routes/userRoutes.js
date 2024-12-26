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
      password, // Store password as it is (not recommended in production)
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

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password matches (plain text comparison)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Check if the user has bank_account and secret_key set
    const { bank_account, secret_key } = user;

    // Respond with the login status
    if (bank_account && secret_key) {
      return res.json({ message: "Login successful", redirectTo: "/" }); // Home route
    } else {
      return res.json({ message: "Login successful", redirectTo: "/setbankinfo" }); // Redirect to set bank info
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/update-bank-info", async (req, res) => {
  const { username, bank_account, secret_key } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bank_account = bank_account;
    user.secret_key = secret_key;
    await user.save();

    res.status(200).json({ message: "Bank information updated successfully" });
  } catch (error) {
    console.error("Error updating bank information:", error);
    res.status(500).json({ message: "Error updating bank information" });
  }
});



module.exports = router;
