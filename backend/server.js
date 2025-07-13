// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // This line is required!

// Connect to MongoDB (get your string from MongoDB Atlas)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error(err));

// Use Routes
const questionsRouter = require('./routes/questions');
app.use('/api/questions', questionsRouter);

const quizHistoryRoutes = require('./routes/quizHistory');
app.use('/api/quiz-history', quizHistoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.get('/', (req, res) => { res.send('Your service is running'); });