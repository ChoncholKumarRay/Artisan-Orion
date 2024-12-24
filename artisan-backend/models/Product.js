const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image_url: { type: String },
  brand: { type: String },
  supplier_id: { type: Number }
});

module.exports = mongoose.model("Product", productSchema);
