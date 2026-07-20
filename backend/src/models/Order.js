const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    customerInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
    }
  },
  {
    timestamps: true,
  }
);

// Safety net to prevent OverwriteModelError
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;