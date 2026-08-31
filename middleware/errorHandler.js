/**
 * middleware/errorHandler.js — P7: Centralized error handler.
 * Handles Mongoose, JWT, and general errors cleanly.
 * Never exposes raw error internals to the client.
 */

function errorHandler(err, req, res, next) {
  console.error('Error Stack:', err.stack);

  // ── JWT errors ─────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Unauthorized — invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  // ── Mongoose validation error ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach((field) => {
      errors[field] = err.errors[field].message;
    });
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // ── Invalid MongoDB ObjectId ──────────────────────────────────────────────
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  // ── Duplicate key (e.g. duplicate email) ─────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  // ── General server error ──────────────────────────────────────────────────
  res.status(500).json({ success: false, message: 'Internal server error' });
}

module.exports = errorHandler;
