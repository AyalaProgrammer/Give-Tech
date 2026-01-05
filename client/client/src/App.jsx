import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; // ייבוא המפענח
import ReactGA from "react-ga4";
import Login from './components/Login';
import VolunteersTable from './components/VolunteersTable';
import AddVolunteer from './components/AddVolunteer';
import './App.css';

ReactGA.initialize("G-HJ69XTBX9V");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // כאן נשמור את פרטי המשתמשת
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoginSuccess = (credentialResponse) => {
    // פענוח הקוד שחזר מגוגל כדי להוציא שם ותמונה
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded); 
    setIsLoggedIn(true);
    
    ReactGA.event({ category: "User", action: "Login_Success" });
  };

  return (
    <GoogleOAuthProvider clientId="973582819268-hsc8eh347h9m7qumtb2t3f2vcoffp8ph.apps.googleusercontent.com">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div style={{ padding: '20px', direction: 'rtl' }}>
          
          {/* סרגל עליון עם תמונת המשתמשת */}
          <div style={styles.headerBar}>
            <div style={styles.userInfo}>
              <img src={user?.picture} alt="user" style={styles.userImage} />
              <span>שלום, <strong>{user?.name}</strong></span>
            </div>
            <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}>התנתקות</button>
          </div>

          <h2 style={{ color: '#005f8d', textAlign: 'center' }}>ניהול מתנדבי GiveTech</h2>
          
          <AddVolunteer onVolunteerAdded={() => setRefreshKey(k => k + 1)} />
          <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ddd' }} />
          <VolunteersTable key={refreshKey} />
        </div>
      )}
    </GoogleOAuthProvider>
  );
}

const styles = {
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '10px 20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '20px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px'
  },
  userImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #005f8d'
  },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default App;