const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products to display at the gallery
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}, "name price image_url"); // Select only required fields
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// GET a single product by product_id
router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId; // Extract product_id from the URL
    const product = await Product.findOne({ _id: productId }, "name description price image_url brand"); // Find product by product_id and exclude _id

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product); // Send the product data
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

module.exports = router;
