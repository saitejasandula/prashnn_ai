// backend/routes/questions.js
const express = require('express');
const router = express.Router();
const { askGemini } = require('../services/gemini');
const UserQuiz = require('../models/UserQuiz');
const QuizHistory = require('../models/QuizHistory');

// GET route to fetch existing quizzes (for future use)
router.get('/', async (req, res) => {
  try {
    const quizzes = await UserQuiz.find().sort({ createdAt: -1 }).limit(10);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route to save quiz results
router.post('/save', async (req, res) => {
  try {
    const { user, topic, questions, answers, score } = req.body;
    const userQuiz = new UserQuiz({
      user,
      topic,
      questions: questions.map((q, idx) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        userAnswer: answers[idx]
      })),
      score
    });
    await userQuiz.save();
    res.json({ message: 'Quiz saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { topic, numQuestions = 5, difficulty = 'easy' } = req.body;
    
    // Validate input
    if (!topic || topic.trim() === '') {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    if (numQuestions < 1 || numQuestions > 20) {
      return res.status(400).json({ error: 'Number of questions must be between 1 and 20' });
    }
    
    const prompt = `
      Generate ${numQuestions} multiple-choice questions about "${topic}".
      The questions should be of ${difficulty} difficulty.
      For each question, provide:
      - The question text
      - Four options (A, B, C, D)
      - The correct answer letter (A/B/C/D)
      Respond in JSON array format like:
      [
        {
          "question": "...",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "answer": "A"
        },
        ...
      ]
    `;
    
    console.log('Generating questions for topic:', topic);
    const geminiResponse = await askGemini(prompt);
    console.log('Gemini response received, length:', geminiResponse.length);

    let questions = [];
    try {
      questions = JSON.parse(geminiResponse);
    } catch (e) {
      console.error('JSON parsing error:', e.message);
      console.log('Raw response:', geminiResponse);
      
      // Try to extract JSON from the response
      const match = geminiResponse.match(/\[.*\]/s);
      if (match) {
        try {
          questions = JSON.parse(match[0]);
        } catch (parseError) {
          throw new Error('Failed to parse Gemini response as JSON. Response may not be in the expected format.');
        }
      } else {
        throw new Error('Failed to parse Gemini response as JSON. No valid JSON array found in response.');
      }
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No valid questions generated. Please try again.');
    }

    questions = questions.map(q => ({
      question: q.question,
      options: q.options.map(opt => opt.replace(/^[A-D]\.\s*/, '')),
      answer: q.answer
    }));

    console.log('Successfully generated', questions.length, 'questions');
    res.json({ questions });
  } catch (err) {
    console.error('Error in /generate route:', err.message);
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
