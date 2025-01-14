const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bank_account: {
    type: Number,
    default: null,
  },
  secret_key: {
    type: Number,
    default: null,
    min: 10000,
    max: 99999,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
  ],
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
