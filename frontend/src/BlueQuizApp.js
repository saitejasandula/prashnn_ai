import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BlueQuizApp.css';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import Button from './Button';
import PropTypes from 'prop-types';

const BlueQuizApp = ({ onNavigate }) => {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('easy');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate score and correctAnswers at the top level so useEffect can access them
  const results = questions.map((question, idx) => {
    const userAnswer = answers[idx];
    const isCorrect = userAnswer === question.answer;
    return {
      question,
      userAnswer,
      isCorrect,
    };
  });
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const score = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;

  const restartQuiz = () => {
    setStep(0);
    setTopic('');
    setQuestions([]);
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
  };

  const generateQuestions = async (selectedTopic = topic) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.post('http://localhost:5000/api/questions/generate', {
        topic: selectedTopic,
        numQuestions,
        difficulty,
      });
      setQuestions(response.data.questions);
      setStep(3);
    } catch (error) {
      setErrorMsg('Failed to generate questions. Please check your connection or try a different topic.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = (preSelectedTopic = null) => {
    if (typeof preSelectedTopic === 'string') {
      setTopic(preSelectedTopic);
    } else {
      setTopic('');
    }
    setStep(2);
  };

  const handleViewHistory = () => {
    alert('Quiz history feature coming soon!');
  };

  useEffect(() => {
    if (step === 4) {
      const saveResult = async () => {
        try {
          await axios.post('/api/quiz-history/save', {
            topic,
            score: Math.round(score),
            totalQuestions: questions.length
          });
        } catch (error) {
          console.error('Failed to save quiz result:', error);
        }
      };
      saveResult();
    }
  }, [step, score, topic, questions.length]);

  // Landing Page
  if (step === 0) {
    return <LandingPage onStartQuiz={() => setStep(1)} />;
  }

  // Dashboard
  if (step === 1) {
    return <Dashboard onStartQuiz={handleStartQuiz} onViewHistory={handleViewHistory} />;
  }

  // Quiz Configuration Screen
  if (step === 2) {
    return (
      <div className="blue-quiz-container">
        <div className="config-card">
          <div className="card-header">
            <h2>Configure Your Quiz</h2>
            <p>Customize your learning experience</p>
          </div>

          <div className="input-group">
            <label>What topic would you like to explore?</label>
            <input
              type="text"
              placeholder="e.g., Space Exploration, World History, Quantum Physics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="topic-input"
            />
          </div>

          <div className="options-row">
            <div className="input-group">
              <label>Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="select-input"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <div className="input-group">
              <label>Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="select-input"
              >
                <option value="easy">Beginner</option>
                <option value="medium">Intermediate</option>
                <option value="hard">Advanced</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <Button
              variant="secondary"
              onClick={() => setStep(1)}
              ariaLabel="Back to Dashboard"
            >
              ← Back to Dashboard
            </Button>
            <Button
              variant="primary"
              disabled={typeof topic !== 'string' || !topic.trim() || isLoading}
              onClick={() => generateQuestions()}
              loading={isLoading}
              ariaLabel="Generate Quiz"
            >
              Generate Quiz
            </Button>
            {errorMsg && (
              <div style={{ color: 'red', marginTop: 8 }} role="alert">{errorMsg}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Questions Screen
  if (step === 3 && questions.length) {
    const question = questions[current];
    const progress = ((current + 1) / questions.length) * 100;

    return (
      <div className="blue-quiz-container">
        <div className="quiz-card">
          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">
              Question {current + 1} of {questions.length}
            </div>
          </div>

          <div className="question-section">
            <h3 className="question-text">{question.question}</h3>
          </div>

          <div className="options-section">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selected === index ? 'selected' : ''}`}
                onClick={() => setSelected(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          <div className="navigation-section">
            <Button
              variant="primary"
              disabled={selected === null}
              onClick={() => {
                const updatedAnswers = [...answers];
                updatedAnswers[current] = String.fromCharCode(65 + selected); // "A", "B", "C", "D"
                setAnswers(updatedAnswers);
                setSelected(null);

                if (current + 1 < questions.length) {
                  setCurrent(current + 1);
                } else {
                  setStep(4);
                }
              }}
              ariaLabel={current + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
            >
              {current + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (step === 4) {
    const getScoreMessage = () => {
      if (score >= 90) return { message: "Excellent! You're a master!", emoji: "🏆" };
      if (score >= 80) return { message: "Great job! Well done!", emoji: "🎉" };
      if (score >= 70) return { message: "Good work! Keep learning!", emoji: "👍" };
      if (score >= 60) return { message: "Not bad! Room for improvement!", emoji: "📚" };
      return { message: "Keep practicing! You'll get better!", emoji: "💪" };
    };

    const scoreInfo = getScoreMessage();

    return (
      <div className="blue-quiz-container">
        <div className="results-card">
          <div className="results-header">
            <h2>Quiz Results</h2>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{Math.round(score)}%</span>
                <span className="score-emoji">{scoreInfo.emoji}</span>
              </div>
              <p className="score-message">{scoreInfo.message}</p>
              <p className="score-details">
                {correctAnswers} out of {questions.length} questions correct
              </p>
            </div>
          </div>

          <h3>Question Breakdown</h3>
          <div className="questions-list">
            {results.map((result, index) => (
              <div
                key={index}
                className={`question-result ${result.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="question-header">
                  <span className="question-number">Q{index + 1}</span>
                  <span className={`result-status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                    {result.isCorrect ? '✓' : '✗'}
                  </span>
                </div>
                <p className="question-text">{result.question.question}</p>
                <div className="answer-details">
                  <div className="answer-item">
                    <span className="answer-label">Your Answer:</span>
                    <span className="answer-value">
                      {result.userAnswer
                        ? result.question.options[result.userAnswer.charCodeAt(0) - 65]
                        : 'No answer'}
                    </span>
                  </div>
                  {!result.isCorrect && (
                    <div className="answer-item">
                      <span className="answer-label">Correct Answer:</span>
                      <span className="answer-value correct">
                        {result.question.options[result.question.answer.charCodeAt(0) - 65]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <Button className="secondary-button" onClick={restartQuiz}>
              Take Another Quiz
            </Button>
            <Button className="primary-button" onClick={() => setStep(1)}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <div>Something went wrong. Please refresh.</div>;
};

BlueQuizApp.propTypes = {
  onNavigate: PropTypes.func,
};

export default BlueQuizApp;