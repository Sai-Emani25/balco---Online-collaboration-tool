import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import BalcoHome from './pages/BalcoHome';
import BalcoRoom from './pages/BalcoRoom';
import './BalcoApp.css';

function BalcoApp() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BalcoHome />} />
          <Route path="/room/:roomId" element={<BalcoRoom />} />
          <Route path="*" element={<BalcoHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default BalcoApp;
