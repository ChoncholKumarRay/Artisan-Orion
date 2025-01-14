const express = require("express");
const User = require("../models/User");
const router = express.Router();

// API endpoint to register user account
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Existing user check
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // New user
    const newUser = new User({
      username,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "Registration Successful!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Check user bank_account and secret_key
    const { bank_account, secret_key } = user;

    if (bank_account === null || secret_key === null) {
      return res.json({
        message: "Login Successful",
        redirectTo: "/set-bank-info",
      });
    } else {
      return res.json({ message: "Login Successful", redirectTo: "/" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update back info
router.post("/update-bank-info", async (req, res) => {
  const { username, bank_account, secret_key } = req.body;

  const bankAccount = parseInt(bank_account, 10);
  const secretKey = parseInt(secret_key, 10);

  try {
    if (isNaN(bankAccount) || isNaN(secretKey)) {
      return res
        .status(400)
        .json({ message: "Bank account and secret key must be valid numbers" });
    }

    if (secretKey < 10000 || secretKey > 99999) {
      return res
        .status(400)
        .json({ message: "Secret key must be a 5-digit number" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update bank_account and secret_key
    user.bank_account = bankAccount;
    user.secret_key = secretKey;
    await user.save();

    res.status(200).json({ message: "Bank information updated successfully" });
  } catch (error) {
    console.error("Error updating bank information:", error);
    res.status(500).json({ message: "Error updating bank information" });
  }
});

// API endpoint to get order history
router.post("/order-history", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.orders || user.orders.length === 0) {
      return res.status(200).json({ message: "No orders found so far!" });
    }

    res.status(200).json({
      orders: user.orders,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Error fetching order history." });
  }
});

module.exports = router;
