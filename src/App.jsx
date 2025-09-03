import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import POSGenerator from './components/POSGenerator';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generator" element={<POSGenerator />} />
      </Routes>
    </Router>
  );
};

export default App;
