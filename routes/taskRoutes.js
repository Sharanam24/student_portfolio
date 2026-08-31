/**
 * routes/taskRoutes.js — P7: All task routes are now protected by authMiddleware.
 * Users can only access their own tasks.
 */

const express        = require('express');
const mongoose       = require('mongoose');
const Task           = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ── Apply authMiddleware to ALL task routes ───────────────────────────────────
router.use(authMiddleware);

// ── Helper: check valid MongoDB ObjectId ──────────────────────────────────────
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ── Validation middleware for POST/PUT ────────────────────────────────────────
function validateTask(req, res, next) {
  const { title, description } = req.body;

  // title is required on POST; optional on PUT (partial update)
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ success: false, message: 'Title cannot exceed 200 characters' });
    }
  }

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ success: false, message: 'Title must be a non-empty string' });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ success: false, message: 'Description must be a string' });
  }

  next();
}

// ── GET /api/tasks — paginated list (only this user's tasks) ──────────────────
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 5);
    const skip  = (page - 1) * limit;

    // Filter by authenticated user — users cannot see each other's tasks
    const filter = { user: req.user.id };

    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      tasks,
      totalTasks,
      totalPages:  Math.ceil(totalTasks / limit) || 1,
      currentPage: page,
      limit,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/tasks/:id ────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/tasks — create (owned by authenticated user) ────────────────────
router.post('/', validateTask, async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/tasks/:id ────────────────────────────────────────────────────────
router.put('/:id', validateTask, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    // Only update if the task belongs to this user (ownership check)
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully', task });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
