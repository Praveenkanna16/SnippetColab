// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SnippetDetailPage from './pages/SnippetDetailPage';
import NewSnippetPage from './pages/NewSnippetPage'; // <-- Import the new page

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/snippet/:id" element={<SnippetDetailPage />} />
            <Route path="/new-snippet" element={<NewSnippetPage />} /> {/* <-- Add this new route */}
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;