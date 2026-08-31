/**
 * models/User.js
 * Mongoose schema for registered users.
 * Passwords are NEVER stored in plain text — only bcrypt hashes.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: [true, 'Email is required'],
    unique:   true,
    trim:     true,
    lowercase: true,   // normalize to lowercase before saving
    match:    [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type:     String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select:   false,
  },
  createdAt: {
    type:    Date,
    default: Date.now,
  },
});

// Never return the password field in API responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
