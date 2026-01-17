import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BalcoHome from './pages/BalcoHome';
import BalcoRoom from './pages/BalcoRoom';
import './BalcoApp.css';

function BalcoApp() {
  // Use PUBLIC_URL so GitHub Pages serves routes under the repo path
  const basename = process.env.PUBLIC_URL || '/balco---Online-collaboration-tool';

  return (
    <Router basename={basename}>
      <div className="App">
        <Routes>
          <Route path="/" element={<BalcoHome />} />
          <Route path="/room/:roomId" element={<BalcoRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default BalcoApp;
