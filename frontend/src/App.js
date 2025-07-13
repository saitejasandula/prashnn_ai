import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import BlueQuizApp from './BlueQuizApp';
import Navigation from './Navigation';

// const API_URL = 'http://localhost:5000/api/questions';
const API_URL = process.env.REACT_APP_API_URL || 'https://prashnn-ai.onrender.com/api/questions';
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    axios.get(API_URL)
      .catch(err => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleLogoClick = () => {
    setCurrentView('home');
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Prashnn.ai...</h2>
          <p>Preparing your learning experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className='app'>
      <Navigation 
        currentStep={currentView}
        onNavigate={handleNavigation}
        onLogoClick={handleLogoClick}
      />
      <div className="app-content">
        {(currentView === 'home' ||
          currentView === 'dashboard' ||
          currentView === 'quiz') && <BlueQuizApp />}
        {currentView === 'history' && (
          <div className="coming-soon">
            <h2>Quiz History</h2>
            <p>This feature is coming soon! Track your progress and review past quizzes.</p>
          </div>
        )}
        {currentView === 'about' && (
          <div className="coming-soon">
            <h2>About Prashnn.ai</h2>
            <p>Learn more about our AI-powered quiz platform and mission.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;