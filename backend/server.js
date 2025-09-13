import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { connectDB } from './db.js';

import loginRoutes from './routes/login.js';
import paymentRoutes from './routes/payment.route.js';
import webhookRoutes from './routes/webhook.js';
import transactionRoutes from './routes/transactions.js';
import authMiddleware from './middleware/auth.js';
import User from './models/User.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/login', loginRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);

app.get('/connectDB', (req, res) => {
  res.send('Server is running and DB is connected!');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Seed default test user
    const hashedPassword = await bcrypt.hash("hii", 10);
    await User.findOneAndUpdate(
      { username: "royston" },
      {
        username: "royston",
        email: "royston@example.com",
        password: hashedPassword,
        role: "trustee",
      },
      { upsert: true, new: true }
    );

    console.log("✅ Test user ready (username: royston, password: hii)");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();
