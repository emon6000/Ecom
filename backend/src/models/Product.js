const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    images: [{ type: String }],
    videoLink: { type: String }, // <-- Restored!
    countInStock: { type: Number, required: true, default: 0 },
    isHidden: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

// The safety net is included here!
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;