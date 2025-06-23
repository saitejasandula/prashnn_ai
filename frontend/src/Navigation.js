import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ currentStep, onNavigate, onLogoClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'quiz', label: 'Take Quiz', icon: '🎯' },
    { id: 'history', label: 'History', icon: '📚' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  const handleNavClick = (itemId) => {
    setIsMenuOpen(false);
    onNavigate(itemId);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand" onClick={onLogoClick}>
          <div className="brand-icon">🧠</div>
          <span className="brand-text">Prashnn.ai</span>
        </div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentStep === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button className="nav-action-btn">
            <span className="action-icon">🔔</span>
          </button>
          <button className="nav-action-btn">
            <span className="action-icon">👤</span>
          </button>
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 