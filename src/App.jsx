import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './UploadPage';
import PublicFormPage from './PublicFormPage';
import AdminPage from './AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/form/:form_id" element={<PublicFormPage />} />
        <Route path="/admin/:form_id" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App; 