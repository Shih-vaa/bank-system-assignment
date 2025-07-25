// src/pages/MakePayment.jsx
import React, { useState } from 'react';
import api from '../api/api';

function MakePayment() {
  const [form, setForm] = useState({
    loan_id: '',
    amount: '',
    payment_type: 'EMI'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    try {
      const res = await api.post(`/payments/${form.loan_id}`, {
        amount: parseFloat(form.amount),
        payment_type: form.payment_type
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <input name="loan_id" placeholder="Loan ID" value={form.loan_id} onChange={handleChange} required /><br />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required /><br />
        <select name="payment_type" value={form.payment_type} onChange={handleChange}>
          <option value="EMI">EMI</option>
          <option value="LUMP_SUM">Lump Sum</option>
        </select><br />
        <button type="submit">Submit Payment</button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h4>✅ Payment Recorded!</h4>
          <p><strong>Remaining Balance:</strong> ₹{result.remaining_balance}</p>
          <p><strong>EMIs Left:</strong> {result.emis_left}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default MakePayment;
