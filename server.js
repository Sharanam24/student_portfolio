const express = require('express');
const cors = require('cors');
const app = express();

// ── CORS — allow requests from the Vite dev server (and any localhost port) ───
app.use(cors({
  origin: /^http:\/\/localhost(:\d+)?$/,
}));

// ── Parse JSON bodies ──────────────────────────────────────────────────────────
// Without this, req.body is undefined on POST / PUT requests.
app.use(express.json());

// ── Logging Middleware (global) ────────────────────────────────────────────────
// Logs HTTP method, URL, and ISO timestamp for every incoming request.
// Must call next() so the request continues down the pipeline.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ── Supplementary: Content-Type check for POST / PUT ──────────────────────────
// Rejects requests that don't send application/json on write operations.
app.use((req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') &&
      !req.is('application/json')) {
    return res.status(415).json({
      error: 'Content-Type must be application/json',
    });
  }
  next();
});

// ── In-memory task store ───────────────────────────────────────────────────────
let tasks = [];
let nextId = 1; // auto-increment ID counter

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /tasks — return all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// POST /tasks — create a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    description: description ? String(description).trim() : '',
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

// Middleware: validate :id is a positive integer before PUT / DELETE
function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Task ID must be a positive integer' });
  }
  req.taskId = id;
  next();
}

// PUT /tasks/:id — update an existing task
app.put('/tasks/:id', validateId, (req, res) => {
  const task = tasks.find(t => t.id === req.taskId);
  if (!task) {
    return res.status(404).json({ error: `Task with id ${req.taskId} not found` });
  }

  const { title, description, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }
    task.title = title.trim();
  }
  if (description !== undefined) task.description = String(description).trim();
  if (completed !== undefined) task.completed = Boolean(completed);

  res.status(200).json(task);
});

// DELETE /tasks/:id — remove a task
app.delete('/tasks/:id', validateId, (req, res) => {
  const index = tasks.findIndex(t => t.id === req.taskId);
  if (index === -1) {
    return res.status(404).json({ error: `Task with id ${req.taskId} not found` });
  }

  const [deleted] = tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted successfully', task: deleted });
});

// ── Supplementary: 404 handler for undefined routes ───────────────────────────
app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// ── Global Error Handler (must be LAST middleware, 4 args) ────────────────────
// Express identifies this as an error handler because it has 4 parameters.
// It catches any error passed via next(err) from route handlers.
// We log the stack internally but never expose it to the client (security).
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
