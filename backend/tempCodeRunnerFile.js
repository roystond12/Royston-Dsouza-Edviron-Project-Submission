import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db.js';
import bcrypt from 'bcrypt';

import loginRoutes from './routes/login.js';
import paymentRoutes from './routes/create-payment.js';
import webhookRoutes from './routes/webhook.js';
import transactionRoutes from './routes/transactions.js';
import orderRoutes from './routes/Order.js';
import authMiddleware from './middleware/auth.js';

import User from './models/User.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/login', loginRoutes);
app.use('/api/webhook', webhookRoutes);

// Protected routes
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/orders', authMiddleware, orderRoutes); // ✅ added

app.get('/connectDB', (req, res) => {
  res.send('Server is running and DB is connected!');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Always update or insert the test user with hashed password
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

    await app.listen(PORT);
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();
