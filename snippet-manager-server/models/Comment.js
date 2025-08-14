// models/Comment.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  snippet: { type: mongoose.Schema.Types.ObjectId, ref: 'Snippet', required: true },
  lineNumber: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);