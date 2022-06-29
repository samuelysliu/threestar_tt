import logo from './logo.svg';
import './App.css';
import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './pages/index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
