import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST new order
router.post("/", async (req, res) => {
  try {
    const { orderId, amount, description, status } = req.body;

    const newOrder = new Order({
      orderId,
      amount,
      description,
      status,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
