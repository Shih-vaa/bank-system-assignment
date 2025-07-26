import { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import SplitText from "./SplitText.jsx";
import TextPressure from './TextPressure';
import ClickSpark from './ClickSpark.jsx';

function App() {
  const [loanId, setLoanId] = useState(''); // For dynamic ledger link
  const [customerId, setCustomerId] = useState(''); // For dynamic overview link

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const menuItems = [
    { path: "/loan", text: "Create Loan" },
    { path: "/payment", text: "Make Payment" },
    { 
      path: loanId ? `/ledger/${loanId}` : "#", 
      text: "View Ledger",
      disabled: !loanId 
    },
    { 
      path: customerId ? `/overview/${customerId}` : "#", 
      text: "Account Overview",
      disabled: !customerId 
    }
  ];

  return (
    <>
      <ClickSpark
        sparkColor="#c623e6"
        sparkSize={3}
        sparkRadius={30}
        sparkCount={12}
        duration={500}
      />

      <div style={{
        padding: 20,
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        backgroundColor: '#fff'
      }}>
        <SplitText
          text="🏦 Bank Lending System"
          className="text-4xl font-bold text-center mb-8 text-white"
          delay={100}
          duration={0.3}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />

        {/* Input fields for loan/customer IDs */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 30px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '10px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Loan ID for Ledger:</label>
            <input
              type="text"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              placeholder="Enter Loan ID"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Customer ID for Overview:</label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Enter Customer ID"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
            />
          </div>
        </div>

        {/* Menu Items */}
        <ul style={{
          listStyle: 'none',
          padding: 0,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {menuItems.map((item, index) => (
            <li key={index} style={{ margin: '20px 0' }}>
              <Link
                to={item.path}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  opacity: item.disabled ? 0.5 : 1,
                  pointerEvents: item.disabled ? 'none' : 'auto'
                }}
                className="hover:scale-10 transition-transform"
              >
                <TextPressure
                  text={item.text}
                  flex={true}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={true}
                  textColor="#000"
                  strokeColor="#FF0000"
                  minFontSize={12}
                  style={{
                    width: '100%',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item.disabled ? '#f0f0f0' : '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                />
              </Link>
              {item.disabled && (
                <p style={{ 
                  color: '#ff4444', 
                  fontSize: '12px', 
                  textAlign: 'center',
                  marginTop: '5px'
                }}>
                  {item.text === "View Ledger" 
                    ? "Please enter a Loan ID above" 
                    : "Please enter a Customer ID above"}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;