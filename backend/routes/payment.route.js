// routes/payment.route.js

import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const router = express.Router();

const PG_KEY = process.env.PG_KEY || 'edvtest01';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';
const BASE_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

router.post('/create-payment', async (req, res) => {
  try {
    const {
      order_id,
      amount,
      school_id,
      student_info
    } = req.body;

    if (!order_id || !amount || !school_id || !student_info?.id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payload = {
      merchantId: PG_KEY,
      merchantTransactionId: order_id,
      merchantUserId: student_info.id,
      amount: amount * 100,
      redirectUrl: 'https://yourdomain.com/redirect', // ⚠️ Set actual redirect page
      redirectMode: 'POST',
      callbackUrl: 'https://yourdomain.com/api/webhook',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const xVerify = jwt.sign(payload, JWT_SECRET);

    const response = await axios.post(
      `${BASE_URL}/pg/v1/pay`,
      { request: payloadBase64 },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-CLIENT-ID': PG_KEY
        }
      }
    );

    const paymentUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url;

    if (!paymentUrl) {
      throw new Error("Payment URL not returned");
    }

    return res.json({ success: true, payment_url: paymentUrl });
  } catch (err) {
    console.error("❌ Payment Error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Payment request failed" });
  }
});

export default router;
