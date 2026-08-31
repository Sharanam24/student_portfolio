/**
 * routes/authRoutes.js
 * POST /api/auth/register  — create account
 * POST /api/auth/login     — get JWT
 * GET  /api/auth/me        — get current user (protected)
 */

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ── Validate input ──────────────────────────────────────────────────────
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Check for duplicate email ───────────────────────────────────────────
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // ── Hash password (NEVER store plain text) ──────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    // ── Save user ───────────────────────────────────────────────────────────
    const user = await User.create({ email: normalizedEmail, password: hashedPassword });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ── Validate input ──────────────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Find user ───────────────────────────────────────────────────────────
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // ── Compare password using bcrypt (NEVER plain text comparison) ─────────
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // ── Generate JWT ────────────────────────────────────────────────────────
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/me — protected: return current user ───────────────────────
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ id: user._id, email: user.email });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
