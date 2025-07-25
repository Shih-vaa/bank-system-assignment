// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Pages
import CreateLoan from './pages/CreateLoan';
import MakePayment from './pages/MakePayment';
import Ledger from './pages/Ledger';
import Overview from './pages/Overview';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/loan" element={<CreateLoan />} />
      <Route path="/payment" element={<MakePayment />} />
      <Route path="/ledger/:loan_id" element={<Ledger />} />
      <Route path="/overview/:customer_id" element={<Overview />} />
    </Routes>
  </BrowserRouter>
    <ToastContainer position="top-center" />
    </>
);
