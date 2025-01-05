const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bank_account: { type: Number, default: null, },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  ordered_products: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true }, // changed to ObjectId
      quantity: { type: Number, required: true },
    },
  ],
  supplier_id: { type: Number, default: 6030 },
  total_price: { type: Number },
  is_verified: { type: Boolean, default: false },
  is_paid: { type: Boolean, default: false },
  status: {
    code: { type: Number },
    message: { type: String },
    date: { type: Date, default: Date.now },
  },
});

module.exports = mongoose.model("Order", orderSchema);
