import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

export default function Ledger() {
  const { loan_id } = useParams(); // Gets loan_id from URL
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await api.get(`/loans/${loan_id}/ledger`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load ledger');
      }
    };
    fetchLedger();
  }, [loan_id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Loan Ledger: {loan_id}</h2>
      <p>Balance: ₹{data.balance_amount}</p>
      <p>EMIs Left: {data.emis_left}</p>
      
      <h3>Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {data.transactions.map((tx) => (
            <tr key={tx.transaction_id}>
              <td>{new Date(tx.date).toLocaleString()}</td>
              <td>₹{tx.amount}</td>
              <td>{tx.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}