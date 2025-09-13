import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  collect_id: { type: String, required: true },
  school_id: { type: String, required: true },
  gateway: { type: String, required: true },
  order_amount: { type: Number, required: true },
  transaction_amount: { type: Number, required: true },
  status: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
  custom_order_id: { type: String, required: true },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
