import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="bg-blue-600 text-white px-4 py-2 flex gap-4">
      <Link to="/">🏠 Home</Link>
      <Link to="/loan">➕ Loan</Link>
      <Link to="/payment">💰 Pay</Link>
      <Link to="/overview/cust123">📊 Overview</Link>
    </nav>
  );
}
