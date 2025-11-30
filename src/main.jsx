import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </BrowserRouter>
);
