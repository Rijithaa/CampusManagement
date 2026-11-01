import React, { useState } from 'react';
import { HomePage } from './pages/Home';
import { StudentsPage } from './pages/Students';
import { TeachersPage } from './pages/Teachers';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">C</div>
          <span>CAMPUS DIRECTORY</span>
        </div>
        <div className="navbar-links">
          <button
            onClick={() => setCurrentPage('home')}
            className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage('students')}
            className={`nav-btn ${currentPage === 'students' ? 'active' : ''}`}
          >
            Students
          </button>
          <button
            onClick={() => setCurrentPage('teachers')}
            className={`nav-btn ${currentPage === 'teachers' ? 'active' : ''}`}
          >
            Teachers
          </button>
        </div>
      </nav>

      {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
      {currentPage === 'students' && <StudentsPage />}
      {currentPage === 'teachers' && <TeachersPage />}
    </div>
  );
}