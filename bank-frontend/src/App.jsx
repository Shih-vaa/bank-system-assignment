import { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import SplitText from "./SplitText.jsx";
import TextPressure from './TextPressure';
import ClickSpark from './ClickSpark.jsx';

function App() {


  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const menuItems = [
    { path: "/loan", text: "Create Loan" },
    { path: "/payment", text: "Make Payment" },
    { path: "/ledger/your-loan-id", text: "View Ledger" },
    { path: "/overview/your-customer-id", text: "Account Overview" }
  ];

  return (
    <>
      {/* ClickSpark now works globally without affecting layout */}
      <ClickSpark
        sparkColor="#c623e6" // Your purple color
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
        backgroundColor: '#fff' // White background for contrast
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
                  display: 'block'
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
                    justifyContent: 'center'
                  }}
                />
              </Link>
            </li>
          ))}
        </ul>


      </div>
    </>
  );
}

export default App;