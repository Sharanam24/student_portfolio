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
    trim:     true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },

  description: {
    type: String,
    trim: true,
  },

  completed: {
    type:    Boolean,
    default: false,
  },

  priority: {
    type:    String,
    enum:    {
      values:  ['low', 'medium', 'high'],
      message: 'Priority must be low, medium, or high',
    },
    default: 'medium',
  },

  startDate: { type: Date, default: null },
  endDate:   { type: Date, default: null },

  // P7: Associate each task with the user who created it.
  // Optional (sparse) so old Practical 5/6 documents without a user field
  // still load without validation errors.
  user: {
    type:   mongoose.Schema.Types.ObjectId,
    ref:    'User',
    sparse: true,   // allows null/missing values in old documents
  },

  createdAt: {
    type:    Date,
    default: Date.now,
  },
});

// ── Supplementary: pre-save hook that trims the title ─────────────────────────
// Even though the schema already has trim:true, this hook demonstrates
// the concept explicitly as required by the practical.
taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  if (typeof next === 'function') {
    next();
  }
});

// ── Export the model ───────────────────────────────────────────────────────────
// Mongoose will use the collection name "tasks" (lowercase + plural of "Task")
module.exports = mongoose.model('Task', taskSchema);
