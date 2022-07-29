import logo from './logo.svg';
import './App.css';
import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './pages/index';
import Dividend from './pages/dividend';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />}></Route>
        <Route path='/dividend' element={<Dividend />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
