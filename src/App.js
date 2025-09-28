import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotePage from './pages/NotePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Kişisel Not Arşivim</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/note/:slug" element={<NotePage />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2025 Notlarım</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;