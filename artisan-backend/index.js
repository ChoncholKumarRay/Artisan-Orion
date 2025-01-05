const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes"); // Import the user routes
const orderRoutes = require("./routes/orderRoutes")

const app = express();

console.log("MongoDB URL:", process.env.MONGO_URL);
console.log("Server Port:", process.env.PORT);

// Middleware
app.use(cors({
  origin: ["https://artisan-orion.vercel.app", "http://localhost:5173"], // Allow multiple origins
  methods: "GET,POST", // Allow POST and GET requests
  allowedHeaders: "Content-Type,Authorization", // Allow specific headers
}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api", userRoutes); // Use user routes for registration and login
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes)

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
