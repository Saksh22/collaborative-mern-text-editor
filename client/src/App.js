import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DocumentEditor from './components/DocumentEditor';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DocumentListPage from './pages/DocumentsPage'; // Ensure this import path is correct

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/documents/:id" element={<DocumentEditor />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/documents" element={<DocumentListPage />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
