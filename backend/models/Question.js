// backend/models/Question.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String], // An array of strings
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Question', QuestionSchema);