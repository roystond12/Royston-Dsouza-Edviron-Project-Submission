import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/payments
 * @desc    Create a payment request
 * @access  Private (JWT required)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { school_id, amount } = req.body;

    if (!school_id || !amount) {
      return res.status(400).json({ message: "Missing school_id or amount" });
    }

    // Create a JWT for this payment
    const payload = {
      school_id,
      amount,
      userId: req.user.id, // comes from decoded auth token
      redirect: `https://royston-dsouza-edviron-project-submission.onrender.com/payment/${school_id}/${amount}`,
    };

    const token = jwt.sign(payload, process.env.PRIVATE_KEY, {
      expiresIn: "1h",
    });

    return res.json({ message: "Payment token created", token, redirect: payload.redirect });
  } catch (error) {
    console.error("❌ Error in POST /api/payments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route   GET /api/payments/:schoolId/:amount
 * @desc    Verify payment request using token
 * @access  Public (but token required in query)
 */
router.get("/:schoolId/:amount", async (req, res) => {
  try {
    const { schoolId, amount } = req.params;
    const { token } = req.query;

    if (!schoolId || !amount) {
      return res.status(400).json({ message: "Missing schoolId or amount" });
    }

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (decoded.school_id !== schoolId || decoded.amount !== Number(amount)) {
      return res.status(403).json({ message: "Forbidden: token data mismatch" });
    }

    return res.json({ message: "Payment verified", decoded });
  } catch (error) {
    console.error("❌ Error in GET /api/payments/:schoolId/:amount:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

