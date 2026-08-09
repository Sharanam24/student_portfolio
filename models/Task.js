/**
 * models/Task.js
 * Mongoose schema and model for the Task resource.
 *
 * Why define a schema in a schema-less database like MongoDB?
 * MongoDB lets you store any shape of document, but that flexibility
 * can lead to inconsistent data. Mongoose adds a schema at the
 * application layer so we always know exactly what fields a task has,
 * what types they are, and which ones are required.
 */

const mongoose = require('mongoose');

// ── Schema definition ─────────────────────────────────────────────────────────
const taskSchema = new mongoose.Schema({
  // title is required — a task without a name is meaningless
  title: {
    type:     String,
    required: [true, 'Title is required'],
    trim:     true,   // automatically strips leading/trailing whitespace
  },

  description: {
    type: String,
    trim: true,
  },

  completed: {
    type:    Boolean,
    default: false,   // every new task starts as incomplete
  },

  // Supplementary: priority field restricted to an enum
  priority: {
    type:    String,
    enum:    {
      values:  ['low', 'medium', 'high'],
      message: 'Priority must be low, medium, or high',
    },
    default: 'medium',
  },

  startDate: {
    type: Date,
    default: null,
  },

  endDate: {
    type: Date,
    default: null,
  },

  createdAt: {
    type:    Date,
    default: Date.now,  // Date.now (not Date.now()) — Mongoose calls it at insert time
  },
});

// ── Supplementary: pre-save hook that trims the title ─────────────────────────
// Even though the schema already has trim:true, this hook demonstrates
// the concept explicitly as required by the practical.
taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  next();
});

// ── Export the model ───────────────────────────────────────────────────────────
// Mongoose will use the collection name "tasks" (lowercase + plural of "Task")
module.exports = mongoose.model('Task', taskSchema);
