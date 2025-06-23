import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Button from './Button';
import PropTypes from 'prop-types';

const Dashboard = ({ onStartQuiz, onViewHistory, onViewStats }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/quiz-history/all')
      .then(res => {
        setHistory(res.data.quizzes);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load quiz history.');
        setLoading(false);
      });
  }, []);

  const totalQuizzes = history.length;
  const totalQuestions = history.reduce((sum, q) => sum + (q.totalQuestions || 0), 0);
  const averageScore = totalQuizzes
    ? Math.round(history.reduce((sum, q) => sum + (q.score || 0), 0) / totalQuizzes)
    : 0;
  // You can implement streak logic if you want, or leave as a placeholder
  const streak = 0;
  const stats = { totalQuizzes, averageScore, totalQuestions, streak };

  const recentQuizzes = history.slice(0, 4).map(quiz => ({
    id: quiz._id,
    topic: quiz.topic,
    score: quiz.score,
    questions: quiz.totalQuestions,
    date: new Date(quiz.date).toLocaleDateString()
  }));

  const popularTopics = [
    'Space Exploration',
    'World History',
    'Quantum Physics',
    'Literature Classics',
    'Artificial Intelligence',
    'Ancient Civilizations'
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back! 👋</h1>
            <p>Ready to continue your learning journey?</p>
          </div>
          <div className="header-actions">
            <button className="primary-button" onClick={onStartQuiz}>
              Start New Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalQuizzes}</div>
              <div className="stat-label">Total Quizzes</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-number">{stats.averageScore}%</div>
              <div className="stat-label">Average Score</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">❓</div>
            <div className="stat-info">
              <div className="stat-number">{stats.totalQuestions}</div>
              <div className="stat-label">Questions Answered</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <div className="stat-number">{stats.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="section-card">
            <div className="section-header">
              <h3>Recent Quizzes</h3>
              <Button className="text-button" onClick={onViewHistory} ariaLabel="View All Quiz History">
                View All
              </Button>
            </div>
            <div className="recent-quizzes">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-item">
                  <div className="quiz-info">
                    <h4>{quiz.topic}</h4>
                    <p>{quiz.questions} questions • {quiz.date}</p>
                  </div>
                  <div className="quiz-score">
                    <span className={`score-badge ${quiz.score >= 80 ? 'excellent' : quiz.score >= 70 ? 'good' : 'needs-improvement'}`}>
                      {quiz.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <h3>Popular Topics</h3>
              <p>Trending subjects to explore</p>
            </div>
            <div className="topics-grid">
              {popularTopics.map((topic, index) => (
                <Button
                  key={index}
                  className="topic-chip"
                  onClick={() => onStartQuiz(topic)}
                  ariaLabel={`Start quiz on ${topic}`}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <div className="action-card">
            <div className="action-icon">🚀</div>
            <h4>Quick Start</h4>
            <p>Begin a new quiz on any topic</p>
            <Button variant="secondary" onClick={onStartQuiz} ariaLabel="Start Quiz">
              Start Quiz
            </Button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">📈</div>
            <h4>View Progress</h4>
            <p>Check your learning statistics</p>
            <Button variant="secondary" onClick={onViewStats} ariaLabel="View Stats">
              View Stats
            </Button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">🎓</div>
            <h4>Learning Path</h4>
            <p>Follow structured learning paths</p>
            <Button variant="secondary" ariaLabel="Explore Paths">
              Explore Paths
            </Button>
          </div>
        </div>

        <div className="quiz-history">
          <h3>Quiz History</h3>
          {history.slice(0, 4).map((quiz) => (
            <div key={quiz._id} className="history-item">
              <div className="history-info">
                <span className="history-topic">{quiz.topic}</span>
                <span className="history-score">{quiz.score}%</span>
                <span className="history-questions">{quiz.totalQuestions} questions</span>
                <span className="history-date">{new Date(quiz.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  onStartQuiz: PropTypes.func,
  onViewHistory: PropTypes.func,
  onViewStats: PropTypes.func,
};

export default Dashboard;