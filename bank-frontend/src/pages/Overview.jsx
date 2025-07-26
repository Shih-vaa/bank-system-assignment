import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

export default function Overview() {
  const { customer_id } = useParams(); // Gets customer_id from URL
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get(`/loans/customer/${customer_id}/overview`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'No loans found');
      }
    };
    fetchOverview();
  }, [customer_id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Customer: {customer_id}</h2>
      <p>Total Loans: {data.total_loans}</p>

      {data.loans.map((loan) => (
        <div key={loan.loan_id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h3>Loan ID: {loan.loan_id}</h3>
          <p>Principal: ₹{loan.principal}</p>
          <p>Total Amount: ₹{loan.total_amount}</p>
          <p>EMIs Left: {loan.emis_left}</p>
          <Link to={`/ledger/${loan.loan_id}`}>View Full Ledger</Link>
        </div>
      ))}
    </div>
  );
}