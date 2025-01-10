const express = require("express");
const axios = require("axios");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const OrderSupply = require("../models/OrderSupply");
const router = express.Router();

const dotenv = require("dotenv");

dotenv.config();

// API endpoint to place a new order
router.post("/", async (req, res) => {
  const { username, phone, address, ordered_products } = req.body;
  // console.log(req.body);

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
      bank_transaction: "",
      status: {
        code: 200,
        message: "Placed",
      },
    });

    const newOrderId = await newOrder.save();
    res.status(201).json({
      order_id: newOrderId._id,
      message: "Order placed successfully.",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order." });
  }
});

// API endpoint to make payment of an order
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
      return res
        .status(400)
        .json({ message: "Invalid bank account or secret key." });
    } else {
      order.is_verified = true;
      // console.log("veriried bank user");
      await order.save();
    }

    const money_receiver = parseInt(process.env.BANK_ACCOUNT, 10);
    const receiver_pin = parseInt(process.env.PIN, 10);
    const money_sender = bankAccount;
    const amount = order.total_price;

    // Call the external payment API
    const paymentRequest = await axios.post(
      "https://teesta.cam-sust.org/api/user/pay-request",
      {
        money_receiver,
        receiver_pin,
        money_sender,
        amount,
      }
    );

    const transaction_id = paymentRequest.data.transaction_id;
    order.bank_transaction = transaction_id;
    order.status.push({
      code: 250,
      message: "Pending Payment",
    });
    await order.save();

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

// Give payment acknowlegdgement to the user
router.post("/payment-acknowledge", async (req, res) => {
  const { orderId, transactionId } = req.body;

  if (!orderId || !transactionId) {
    return res
      .status(400)
      .json({ message: "Order ID and Transaction ID are required." });
  }

  try {
    // Verify order and transaction id
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (
      order.bank_transaction !== transactionId ||
      order.is_verified === false
    ) {
      return res.status(400).json({ message: "Bank transaction not matched." });
    }

    // Checking transaction id status from bank user api
    const transactionCheckResponse = await fetch(
      "https://teesta.cam-sust.org/api/user/transaction-check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transaction_id: transactionId }),
      }
    );

    const transactionCheckData = await transactionCheckResponse.json();

    if (
      !transactionCheckResponse.ok ||
      transactionCheckData.success === false
    ) {
      return res.status(400).json({ message: "Bank transaction incomplete." });
    }

    // Calculate profit and supplier payable
    const profit = order.total_price * 0.1; // 10% profit
    const supplierPayable = order.total_price - profit;

    // Send money to the supplier
    const moneySender = process.env.BANK_ACCOUNT;
    const senderPin = process.env.PIN;
    const moneyReceiver = process.env.COSMOBD_BANK_ACCOUNT;
    const amount = supplierPayable;

    const sendMoneyResponse = await fetch(
      "https://teesta.cam-sust.org/api/user/send-money",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          money_sender: moneySender,
          sender_pin: senderPin,
          money_receiver: moneyReceiver,
          amount,
        }),
      }
    );

    const sendMoneyData = await sendMoneyResponse.json();

    if (!sendMoneyResponse.ok || sendMoneyData.success === false) {
      return res.status(400).json({
        message:
          "Error in sending money to the supplier. Contact with Artisan Orion admin",
      });
    }

    let supplierId = `SUP${Date.now()}`;

    // Unique supplier ID
    let existingSupplierId = await OrderSupply.findOne({
      supplier_id: supplierId,
    });
    while (existingSupplierId) {
      supplierId = `SUP${Date.now()}`;
      existingSupplierId = await OrderSupply.findOne({ supplierId });
    }

    const newOrderSupply = new OrderSupply({
      order_id: orderId,
      supply_id: supplierId,
      user_transaction: transactionId,
      supplier_transaction: sendMoneyData.transaction_id,
      profit: profit,
    });

    const verificationCode = process.env.MY_VERIFICATION_CODE;

    if (!verificationCode) {
      console.error("Verification code not found in environment variables.");
      return res.status(500).json({
        message: "Server configuration error: Verification code not found.",
      });
    }

    try {
      // Transform ordered_products to include correct product IDs
      const transformedProducts = await Promise.all(
        order.ordered_products.map(async (item) => {
          const product = await Product.findById(item.product_id);
          if (!product) {
            throw new Error(`Product not found with ID: ${item.product_id}`);
          }
          return { product_id: product.product_id, quantity: item.quantity };
        })
      );

      // Call the /req-supply API
      const reqBodyResponse = await fetch(
        "https://cosmo.cam-sust.org/api/user/req-supply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verification_code: verificationCode,
            supply_id: supplierId,
            ordered_products: transformedProducts, // Use the transformed products
            payment: supplierPayable,
            bank_transaction: sendMoneyData.transaction_id,
            buyer_name: order.username,
            phone: order.phone,
            address: order.address,
          }),
        }
      );

      const rawResponse = await reqBodyResponse.text(); // Get raw response
      // console.log("Raw response from /req-supply:", rawResponse);
      // console.log("HTTP Status from /req-supply:", reqBodyResponse.status);

      if (!reqBodyResponse.ok) {
        throw new Error(`HTTP Error ${reqBodyResponse.status}: ${rawResponse}`);
      }

      const reqBodyData = JSON.parse(rawResponse);
      if (!reqBodyData.success) {
        return res.status(400).json({
          message:
            reqBodyData.message || "Failed to process supply acknowledgment.",
        });
      }

      console.log("Supply acknowledgment successful:", reqBodyData);
    } catch (error) {
      console.error("Error in /req-supply call:", error.message);
      return res.status(500).json({
        message: "Error processing supply acknowledgment.",
      });
    }

    // Update order status and mark as paid
    order.is_paid = true;
    order.status.push({ code: 350, message: "Payment Successful" });
    await order.save();
    await newOrderSupply.save();
    console.log("OrderSupply document created successfully.");

    return res
      .status(200)
      .json({ message: "Payment successful and acknowledged." });
  } catch (error) {
    console.error("Error in payment acknowledgment:", error);
    return res
      .status(500)
      .json({ message: "Error processing payment acknowledgment." });
  }
});

// API endpoint to send order status to the user
router.post("/check-status", async (req, res) => {
  const { order_id, username } = req.body;

  if (!order_id || !username) {
    return res
      .status(400)
      .json({ message: "Order ID and username are required." });
  }

  try {
    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    if (order.username !== username) {
      return res.status(403).json({ message: "Unauthorized access." });
    }
    return res.status(200).json({ status: order.status });
  } catch (error) {
    console.error("Error fetching order status:", error);
    return res.status(500).json({ message: "Error fetching order status." });
  }
});

// API endpoint to get updated order status from the supplier and add it to the orders collection.
router.post("/update-status", async (req, res) => {
  try {
    const { supply_id, code, status, verification_code } = req.body;

    if (!supply_id || !code || !status || !verification_code) {
      return res.status(400).json({
        message: "Supply ID, code, status, and verification code are required.",
      });
    }

    if (verification_code !== process.env.COSMOBD_VERIFICATION_CODE) {
      return res.status(403).json({ message: "Invalid verification code." });
    }

    const supply = await OrderSupply.findOne({ supply_id });
    if (!supply) {
      return res.status(404).json({ message: "Supply order not found." });
    }

    const orderId = supply.order_id;
    if (!orderId) {
      return res
        .status(500)
        .json({ message: "Order ID is missing in the supply record." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const statusCode = parseInt(code, 10);

    // Push the new status into the order's status array
    order.status.push({
      code: statusCode,
      message: `${status} by Supplier`,
    });

    await order.save();
    res.status(200).json({ message: "Order status updated successfully." });
  } catch (error) {
    console.error("Error in update-status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
});

module.exports = router;
