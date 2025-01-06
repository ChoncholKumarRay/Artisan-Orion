const express = require("express");
const axios = require("axios");
const Order = require("../models/Order");
const User = require("../models/User");
const router = express.Router();

const dotenv = require("dotenv");

dotenv.config();

// Route to place a new order
router.post("/", async (req, res) => {
  const { username, phone, address, ordered_products } = req.body;

  if (!username || !phone || !address || !ordered_products) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newOrder = new Order({
      username,
      phone,
      address,
      ordered_products,
      total_price: ordered_products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      ),
      is_paid: false,
      status: {
        code: 200,
        message: "Placed",
      },
    });

    const newOrderId = await newOrder.save();
    res
      .status(201)
      .json({ order_id: newOrderId._id, message: "Order placed successfully." });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order." });
  }
});

// Route to handle payment
router.post("/payment", async (req, res) => {
  const { order_id, username, bank_account, secret_key } = req.body;
  const bankAccount = parseInt(bank_account, 10);
  const secretKey = parseInt(secret_key, 10);

  if (!order_id || !username || !bank_account || !secret_key) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    if (order.is_paid) {
      return res.status(400).json({ message: "Order is already paid." });
    }
    if (user.bank_account !== bankAccount || user.secret_key !== secretKey) {
      return res.status(400).json({ message: "Invalid bank account or secret key." });
    } else{
      order.is_verified=true;
      console.log("veriried bank user");
      await order.save();
    }

    const money_receiver=parseInt(process.env.BANK_ACCOUNT, 10);
    const receiver_pin=parseInt(process.env.PIN, 10);
    const money_sender=bankAccount
    const amount=order.total_price

    // Call the external payment API
    const paymentRequest = await axios.post("http://localhost:5001/api/user/pay-request", {
      money_receiver,
      receiver_pin,
      money_sender,
      amount,
    });

    const transaction_id = paymentRequest.data.transaction_id;
    // Respond with the transaction ID
    res.status(200).json({
      message: paymentRequest.data.message,
      transaction_id,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Error processing payment." });
  }
});

module.exports = router;
