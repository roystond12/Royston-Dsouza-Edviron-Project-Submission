import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) throw new Error('PRIVATE_KEY is missing in .env');

// POST /api/login
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ username }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      privateKey,
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
