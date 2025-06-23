const express = require('express');
const router = express.Router();
const QuizHistory = require('../models/QuizHistory');

router.post('/save', async (req, res) => {
  try {
    const { topic, score, totalQuestions } = req.body;
    const quiz = new QuizHistory({ topic, score, totalQuestions });
    await quiz.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const quizzes = await QuizHistory.find().sort({ date: -1 }).limit(20);
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;