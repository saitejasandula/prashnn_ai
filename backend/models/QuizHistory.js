const mongoose = require('mongoose');

const QuizHistorySchema = new mongoose.Schema({
  topic: String,
  score: Number,
  totalQuestions: Number,
  date: { type: Date, default: Date.now }
  // Add userId if you implement authentication
});

module.exports = mongoose.model('QuizHistory', QuizHistorySchema);