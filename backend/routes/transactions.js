import express from "express";
import OrderStatus from "../models/OrderStatus.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "payment_time";
    const order = req.query.order === "asc" ? 1 : -1;

    const total = await OrderStatus.countDocuments();

    const transactions = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order_info",
        },
      },
      { $unwind: "$order_info" },
      {
        $project: {
          collect_id: 1,
          school_id: "$order_info.school_id",
          gateway: "$order_info.gateway_name",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: 1,
          payment_time: 1,
        },
      },
      { $sort: { [sort]: order } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      transactions,
    });
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

