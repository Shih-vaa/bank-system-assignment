import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

export default function Overview() {
  const { customer_id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/loans/customer/${customer_id}/overview`);
        setData(res.data);
      } catch (e) {
        setErr(e.response?.data?.error || 'Failed to load overview');
      }
    })();
  }, [customer_id]);

  if (err) return <p style={{ color: 'red' }}>{err}</p>;
  if (!data) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>Account Overview: {data.customer_id}</h2>
      <p><b>Total Loans:</b> {data.total_loans}</p>

      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Principal (₹)</th>
            <th>Total (₹)</th>
            <th>Interest (₹)</th>
            <th>EMI (₹)</th>
            <th>Paid (₹)</th>
            <th>EMIs Left</th>
            <th>Ledger</th>
          </tr>
        </thead>
        <tbody>
          {data.loans.map(l => (
            <tr key={l.loan_id}>
              <td>{l.loan_id}</td>
              <td>{l.principal}</td>
              <td>{l.total_amount}</td>
              <td>{l.total_interest}</td>
              <td>{l.emi_amount}</td>
              <td>{l.amount_paid}</td>
              <td>{l.emis_left}</td>
              <td><Link to={`/ledger/${l.loan_id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
