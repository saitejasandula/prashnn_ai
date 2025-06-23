const mongoose = require('mongoose');

const UserQuizSchema = new mongoose.Schema({
  user: { type: String, required: true }, // e.g., "user 1"
  topic: { type: String, required: true },
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
      userAnswer: String
    }
  ],
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserQuiz', UserQuizSchema);