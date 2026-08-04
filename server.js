const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app = express();

// ── Persistence helpers ────────────────────────────────────────────────────────
// tasks.json lives next to server.js — survives server restarts.
const DB_FILE = path.join(__dirname, 'tasks.json');

function loadTasks() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      tasks  = parsed.tasks  ?? [];
      nextId = parsed.nextId ?? (tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1);
      console.log(`Loaded ${tasks.length} task(s) from ${DB_FILE}`);
    }
  } catch (err) {
    console.warn('Could not load tasks.json — starting fresh:', err.message);
  }
}

function saveTasks() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({ tasks, nextId }, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save tasks.json:', err.message);
  }
}

// ── CORS — allow requests from any localhost port (Vite, Next.js, etc.) ───────
app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/ }));

// ── Parse JSON bodies ──────────────────────────────────────────────────────────
app.use(express.json());

// ── Logging Middleware ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ── Content-Type guard for POST / PUT ─────────────────────────────────────────
app.use((req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && !req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  next();
});

// ── Task store (loaded from disk on startup) ───────────────────────────────────
let tasks  = [];
let nextId = 1;
loadTasks();

// ── Route helpers ──────────────────────────────────────────────────────────────
function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Task ID must be a positive integer' });
  }
  req.taskId = id;
  next();
}

// ── GET /tasks ─────────────────────────────────────────────────────────────────
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// ── POST /tasks ────────────────────────────────────────────────────────────────
app.post('/tasks', (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }

  const today = new Date().toISOString().split('T')[0];
  if (startDate && startDate < today) {
    return res.status(400).json({ error: 'startDate cannot be in the past' });
  }
  if (endDate && endDate < today) {
    return res.status(400).json({ error: 'endDate cannot be in the past' });
  }
  if (startDate && endDate && endDate < startDate) {
    return res.status(400).json({ error: 'endDate cannot be before startDate' });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    description: description ? String(description).trim() : '',
    completed: false,
    startDate: startDate || null,
    endDate:   endDate   || null,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks();
  res.status(201).json(task);
});

// ── PUT /tasks/:id ─────────────────────────────────────────────────────────────
app.put('/tasks/:id', validateId, (req, res) => {
  const task = tasks.find(t => t.id === req.taskId);
  if (!task) return res.status(404).json({ error: `Task with id ${req.taskId} not found` });

  const { title, description, completed, startDate, endDate } = req.body;
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '')
      return res.status(400).json({ error: 'title must be a non-empty string' });
    task.title = title.trim();
  }
  if (description !== undefined) task.description = String(description).trim();
  if (completed   !== undefined) task.completed   = Boolean(completed);
  if (startDate   !== undefined) task.startDate   = startDate || null;
  if (endDate     !== undefined) task.endDate     = endDate   || null;

  // validate dates are not in the past
  const today = new Date().toISOString().split('T')[0];
  if (task.startDate && task.startDate < today) {
    return res.status(400).json({ error: 'startDate cannot be in the past' });
  }
  if (task.endDate && task.endDate < today) {
    return res.status(400).json({ error: 'endDate cannot be in the past' });
  }
  if (task.startDate && task.endDate && task.endDate < task.startDate) {
    return res.status(400).json({ error: 'endDate cannot be before startDate' });
  }

  saveTasks();                          // ← persist immediately
  res.status(200).json(task);
});

// ── DELETE /tasks/:id ──────────────────────────────────────────────────────────
app.delete('/tasks/:id', validateId, (req, res) => {
  const index = tasks.findIndex(t => t.id === req.taskId);
  if (index === -1) return res.status(404).json({ error: `Task with id ${req.taskId} not found` });

  const [deleted] = tasks.splice(index, 1);
  saveTasks();                          // ← persist immediately
  res.status(200).json({ message: 'Task deleted successfully', task: deleted });
});

// ── 404 for unknown routes ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// ── Global error handler (must be last, 4 args) ────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// ── Start ──────────────────────────────────────────────────────────────────────
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
