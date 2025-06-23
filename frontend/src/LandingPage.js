import React, { useState } from 'react';
import './LandingPage.css';
import Button from './Button';

const LandingPage = ({ onStartQuiz }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="landing-container">
      {/* Background Elements */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Main Content */}
      <div className="landing-content">
        <div className="hero-section">
          <div className="logo-container">
            <div className="logo-icon">🧠</div>
            <h1 className="main-title">
              Prashnn.ai
              <span className="title-accent">Quiz Platform</span>
            </h1>
          </div>
          
          <p className="hero-description">
            Experience the future of learning with AI-powered quizzes. 
            Test your knowledge on any topic with intelligent, adaptive questions.
          </p>

          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Topics Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Quizzes Taken</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">User Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title">Why Choose Prashnn.ai?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Questions</h3>
              <p>Advanced AI generates unique, relevant questions tailored to your chosen topic and difficulty level.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Adaptive Difficulty</h3>
              <p>Choose from beginner to advanced levels, with questions that match your expertise perfectly.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Analytics</h3>
              <p>Get comprehensive feedback with detailed explanations and performance insights.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Results</h3>
              <p>Receive immediate feedback and scores with detailed breakdowns of your performance.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Any Topic</h3>
              <p>From science to history, literature to technology - explore any subject that interests you.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Perfect experience across all devices - desktop, tablet, or mobile.</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Test Your Knowledge?</h2>
            <p>Join thousands of learners who are already using Prashnn.ai to enhance their learning experience.</p>
            
            <Button
              className="cta-button"
              onClick={onStartQuiz}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              ariaLabel="Start Your Quiz Journey"
            >
              <span>Start Your Quiz Journey</span>
              <div className={`button-arrow ${isHovered ? 'hovered' : ''}`}>
                →
              </div>
            </Button>
          </div>
        </div>

        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Prashnn.ai</h4>
              <p>Empowering learning through intelligent quiz experiences.</p>
            </div>
            
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                <li>AI-Generated Questions</li>
                <li>Multiple Difficulty Levels</li>
                <li>Instant Results</li>
                <li>Topic Variety</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Prashnn.ai. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage; 