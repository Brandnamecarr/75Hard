import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// authorization context 
import { AuthContext } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// user components
import Wrapper from './components/Wrapper';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CurrentChallenge from './components/CurrentChallenge';

// test components
import TestPage from './components/TestComponents/TestPage';


function App() {
  var temp = false;
  var TEST_MODE = false;
  if (temp) {
    return (
      <div>
        <CurrentChallenge />
      </div>
    )
  }
  else if (TEST_MODE) {
    return (
      <div>
        <TestPage />
      </div>
    )
  }
  else {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Wrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/UnitTests" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
    </div>
  )}
};

export default App;
