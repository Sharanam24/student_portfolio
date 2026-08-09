/**
 * middleware/errorHandler.js
 * Centralized Express error-handling middleware.
 *
 * Express identifies this as an error handler because it has 4 parameters.
 * It must be registered LAST in server.js after all routes.
 *
 * Why not send raw Mongoose errors to the client?
 * Raw errors can expose internal database structure, field names, and stack
 * traces — a security risk. We always return a clean, structured JSON response.
 */

const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  // ── 1. Mongoose validation error (e.g. missing required title) ────────────
  if (err.name === 'ValidationError') {
    const errors = {};
    // Extract each field's error message into a plain object
    Object.keys(err.errors).forEach((field) => {
      errors[field] = err.errors[field].message;
    });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // ── 2. Invalid MongoDB ObjectId (CastError) ────────────────────────────────
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // ── 3. MongoDB duplicate key error ─────────────────────────────────────────
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate value — a task with that data already exists',
    });
  }

  // ── 4. General / unknown server error ─────────────────────────────────────
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

module.exports = errorHandler;
