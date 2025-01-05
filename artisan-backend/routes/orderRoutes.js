// orderRoutes.js (create a new file in your routes directory)
const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

router.post("/", async (req, res) => {
  const { username, phone, address, ordered_products } = req.body;

//   console.log(req.body);

  if (!username || !phone || !address || !ordered_products) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newOrder = new Order({
      username,
      phone,
      address,
      ordered_products,
      //TODO: I will get total price by getting price using product_id from database
      total_price: ordered_products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      ),
      is_paid: false,
      status: {
        code: 200,
        message: "ordered",
      },
    });

    const newOrderId = await newOrder.save();
    res.status(201).json({ order_id: newOrderId._id, message: "Order placed successfully." });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order." });
  }
});

module.exports = router;
