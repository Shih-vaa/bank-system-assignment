// src/pages/CreateLoan.jsx
import React, { useState } from 'react';
import api from '../api/api';

function CreateLoan() {
  const [form, setForm] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const res = await api.post('/loans', form);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Create New Loan</h2>
      <form onSubmit={handleSubmit}>
        <input name="customer_id" placeholder="Customer ID" value={form.customer_id} onChange={handleChange} required /><br />
        <input name="loan_amount" type="number" placeholder="Loan Amount" value={form.loan_amount} onChange={handleChange} required /><br />
        <input name="loan_period_years" type="number" placeholder="Loan Period (Years)" value={form.loan_period_years} onChange={handleChange} required /><br />
        <input name="interest_rate_yearly" type="number" placeholder="Interest Rate (%)" value={form.interest_rate_yearly} onChange={handleChange} required /><br />
        <button type="submit">Create Loan</button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h4>✅ Loan Created!</h4>
          <p><strong>Loan ID:</strong> {result.loan_id}</p>
          <p><strong>Total Payable:</strong> ₹{result.total_amount_payable}</p>
          <p><strong>Monthly EMI:</strong> ₹{result.monthly_emi}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateLoan;
