/**
 * server.js — Practical 5: MongoDB Integration with Mongoose
 *
 * Architecture:
 *   Client/Postman
 *       |
 *       v
 *   Express.js Server  (this file)
 *       |
 *       v
 *   Mongoose ODM       (models/Task.js)
 *       |
 *       v
 *   MongoDB Database
 *       └── tasks collection
 */

// ── Load environment variables FIRST ─────────────────────────────────────────
// dotenv reads the .env file and puts variables into process.env
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const path      = require('path');
const fs        = require('fs');
const multer    = require('multer');

const taskRoutes    = require('./routes/taskRoutes');
const authRoutes    = require('./routes/authRoutes');
const errorHandler  = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── STEP 5: Connect to MongoDB using Mongoose ─────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    // Log the message but never log the full connection string (security)
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // stop the server — no point running without a database
  });

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/ }));

// ── Parse JSON bodies ─────────────────────────────────────────────────────────
app.use(express.json());

// ── Logging Middleware ────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ── Content-Type guard for write operations (skip multipart) ──────────────────
app.use((req, res, next) => {
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    !req.is('application/json') &&
    !req.is('multipart/form-data')
  ) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  next();
});

// ── Mount routes ─────────────────────────────────────────────────────────────
// Auth routes (public) — register, login, /me
app.use('/api/auth', authRoutes);

// Task CRUD routes (protected by authMiddleware inside taskRoutes.js)
app.use('/api/tasks', taskRoutes);

// Legacy unversioned routes kept for Practical 4/5/6 backward compatibility
app.use('/tasks', taskRoutes);

// ────────────────────────────────────────────────────────────────────────────
// Certificate upload routes (from Practical 4 extension — kept intact)
// ────────────────────────────────────────────────────────────────────────────
const CERT_DIR  = path.join(__dirname, 'certificates');
const CERT_FILE = path.join(__dirname, 'certificates.json');

if (!fs.existsSync(CERT_DIR)) fs.mkdirSync(CERT_DIR);

let certs  = [];
let certId = 1;

function loadCerts() {
  try {
    if (fs.existsSync(CERT_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(CERT_FILE, 'utf8'));
      certs  = parsed.certs  ?? [];
      certId = parsed.certId ?? (certs.length ? Math.max(...certs.map(c => c.id)) + 1 : 1);
    }
  } catch (err) {
    console.warn('Could not load certificates.json:', err.message);
  }
}

function saveCerts() {
  try { fs.writeFileSync(CERT_FILE, JSON.stringify({ certs, certId }, null, 2), 'utf8'); }
  catch (err) { console.error('Failed to save certificates.json:', err.message); }
}

loadCerts();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CERT_DIR),
  filename:    (req, file, cb) => {
    const safe = Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safe);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','application/pdf'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPEG, PNG, WEBP, PDF allowed'));
  },
});

app.use('/certificates/files', express.static(CERT_DIR));

app.get('/certificates', (req, res) => {
  res.status(200).json(certs);
});

app.post('/certificates', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { title, issuer, issueDate } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'title is required' });

  const cert = {
    id: certId++, title: title.trim(), issuer: issuer ? issuer.trim() : '',
    issueDate: issueDate || null, filename: req.file.filename,
    mimetype: req.file.mimetype, url: `/certificates/files/${req.file.filename}`,
    uploadedAt: new Date().toISOString(),
  };
  certs.push(cert);
  saveCerts();
  res.status(201).json(cert);
});

app.delete('/certificates/:id', (req, res) => {
  const id  = Number(req.params.id);
  const idx = certs.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: `Certificate ${id} not found` });
  const [removed] = certs.splice(idx, 1);
  const filePath = path.join(CERT_DIR, removed.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  saveCerts();
  res.status(200).json({ message: 'Certificate deleted', certificate: removed });
});

// ── 404 for unknown routes ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// ── STEP 10: Global error handler — MUST be last ──────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
