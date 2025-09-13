import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: String,
  amount: Number,
  description: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
