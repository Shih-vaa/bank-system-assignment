import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

export default function Ledger() {
  const { loan_id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/loans/${loan_id}/ledger`);
        setData(res.data);
      } catch (e) {
        setErr(e.response?.data?.error || 'Failed to load ledger');
      }
    })();
  }, [loan_id]);

  if (err) return <p style={{ color: 'red' }}>{err}</p>;
  if (!data) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>Ledger: {data.loan_id}</h2>

      <section>
        <p><b>Customer:</b> {data.customer_id}</p>
        <p><b>Principal:</b> ₹{data.principal}</p>
        <p><b>Total Amount:</b> ₹{data.total_amount}</p>
        <p><b>Monthly EMI:</b> ₹{data.monthly_emi}</p>
        <p><b>Paid:</b> ₹{data.amount_paid}</p>
        <p><b>Balance:</b> ₹{data.balance_amount}</p>
        <p><b>EMIs Left:</b> {data.emis_left}</p>
      </section>

      <h3>Transactions</h3>
      {data.transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map(t => (
              <tr key={t.transaction_id}>
                <td>{t.transaction_id}</td>
                <td>{new Date(t.date).toLocaleString()}</td>
                <td>{t.type}</td>
                <td>{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
