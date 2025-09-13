  import express from 'express';
  import jwt from 'jsonwebtoken';
  import bcrypt from 'bcrypt';
  import User from '../models/User.js';

  const router = express.Router();

  // Ensure PRIVATE_KEY is set
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY is not set in environment variables');
  }

  // POST /api/login
  router.post('/', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const user = await User.findOne({ username }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // ✅ Compare plain password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // ✅ Generate JWT
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        privateKey,
        { algorithm: 'HS256', expiresIn: '1h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error('❌ Login error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Fallback route
  router.get('/', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  export default router;
