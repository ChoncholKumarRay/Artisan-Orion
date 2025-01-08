const mongoose = require("mongoose");

const orderSupplySchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "orders", required: true },
    supply_id: { type: String, required: true, unique: true },
    user_transaction: { type: String, required: true },
    supplier_transaction: { type: String, required: true},
    profit: { type: Number, required: true },
  }
);
module.exports = mongoose.model("OrderSupply", orderSupplySchema, "order-supply");
