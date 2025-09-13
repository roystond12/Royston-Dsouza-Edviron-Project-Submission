// backend/routes/webhook.js
import express from "express";
import WebhookLog from "../models/WebhookLog.js"; 

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const log = new WebhookLog({
      gateway_name: req.body?.order_info?.gateway || "Unknown",
      payload: req.body,
    });

    await log.save();
    res.status(200).json({ message: "✅ Webhook log saved" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

