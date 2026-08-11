/**
 * routes/taskRoutes.js
 * All CRUD routes for the Task resource.
 * Every async operation is wrapped in try/catch and errors
 * are forwarded to the global error handler via next(err).
 */

const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const router = express.Router();

// ── Helper: check if a string is a valid MongoDB ObjectId ─────────────────────
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ── GET /tasks — return tasks with server-side pagination ─────────────────────
// Query params: ?page=1&limit=5
// Returns: { tasks, totalTasks, totalPages, currentPage }
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 5);
    const skip  = (page - 1) * limit;

    // Run both queries in parallel for efficiency
    const [tasks, totalTasks] = await Promise.all([
      Task.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(),
    ]);

    res.status(200).json({
      tasks,
      totalTasks,
      totalPages:  Math.ceil(totalTasks / limit),
      currentPage: page,
      limit,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /tasks/:id — return a single task by MongoDB ObjectId ─────────────────
router.get('/:id', async (req, res, next) => {
  try {
    // Reject malformed IDs before hitting the database
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// ── POST /tasks — create a new task ───────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);       // 201 = Created
  } catch (err) {
    next(err);                        // Mongoose ValidationError goes to errorHandler
  }
});

// ── PUT /tasks/:id — update an existing task ──────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new:          true,   // return the updated document (not the old one)
        runValidators: true,  // re-run schema validation on the updated fields
      }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /tasks/:id — delete a task ─────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully', task });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
