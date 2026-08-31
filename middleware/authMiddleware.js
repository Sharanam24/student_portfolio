/**
 * middleware/authMiddleware.js
 * Verifies JWT from the Authorization: Bearer <token> header.
 * Sets req.user = decoded payload on success.
 * Returns 401 for missing, malformed, invalid, or expired tokens.
 * jwt.verify() is always inside try/catch — server NEVER crashes on bad tokens.
 */

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // ── Check header exists and starts with "Bearer " ─────────────────────────
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized — no token provided' });
  }

  const token = authHeader.split(' ')[1];

  // ── Verify token — MUST be in try/catch ──────────────────────────────────
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // { id, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Unauthorized — invalid token' });
  }
}

module.exports = authMiddleware;
