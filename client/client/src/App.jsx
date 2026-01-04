// import React, { useState, useEffect } from 'react';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode"; // ייבוא המפענח
// import ReactGA from "react-ga4";
// import Login from './components/Login';
// import VolunteersTable from './components/VolunteersTable';
// import AddVolunteer from './components/AddVolunteer';
// import './App.css';

// ReactGA.initialize("G-HJ69XTBX9V");

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null); // כאן נשמור את פרטי המשתמשת
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleLoginSuccess = (credentialResponse) => {
//     // פענוח הקוד שחזר מגוגל כדי להוציא שם ותמונה
//     const decoded = jwtDecode(credentialResponse.credential);
//     setUser(decoded); 
//     setIsLoggedIn(true);

//     ReactGA.event({ category: "User", action: "Login_Success" });
//   };

//   return (
//     <GoogleOAuthProvider clientId="973582819268-hsc8eh347h9m7qumtb2t3f2vcoffp8ph.apps.googleusercontent.com">
//       {!isLoggedIn ? (
//         <Login onLoginSuccess={handleLoginSuccess} />
//       ) : (
//         <div style={{ padding: '20px', direction: 'rtl' }}>

//           {/* סרגל עליון עם תמונת המשתמשת */}
//           <div style={styles.headerBar}>
//             <div style={styles.userInfo}>
//               <img src={user?.picture} alt="user" style={styles.userImage} />
//               <span>שלום, <strong>{user?.name}</strong></span>
//             </div>
//             <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}>התנתקות</button>
//           </div>

//           <h2 style={{ color: '#005f8d', textAlign: 'center' }}>ניהול מתנדבי GiveTech</h2>

//           <AddVolunteer onVolunteerAdded={() => setRefreshKey(k => k + 1)} />
//           <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ddd' }} />
//           <VolunteersTable key={refreshKey} />
//         </div>
//       )}
//     </GoogleOAuthProvider>
//   );
// }

// const styles = {
//   headerBar: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: '10px 20px',
//     borderRadius: '12px',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
//     marginBottom: '20px'
//   },
//   userInfo: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     fontSize: '16px'
//   },
//   userImage: {
//     width: '40px',
//     height: '40px',
//     borderRadius: '50%',
//     border: '2px solid #005f8d'
//   },
//   logoutBtn: {
//     backgroundColor: '#ff4d4d',
//     color: 'white',
//     border: 'none',
//     padding: '8px 16px',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontWeight: 'bold'
//   }
// };

// export default App;




import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import ReactGA from "react-ga4";
import axios from 'axios'; // הוספתי ייבוא של אקסיוס
import Login from './components/Login';
import VolunteersTable from './components/VolunteersTable';
import AddVolunteer from './components/AddVolunteer';
import MyMessages from './components/MyMessages'; // ייבוא הקומפוננטה החדשה של ההודעות
import './App.css';

ReactGA.initialize("G-HJ69XTBX9V");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [volunteerId, setVolunteerId] = useState(null); // הוספת State ל-ID של המתנדבת מהדאטה-בייס
  const [refreshKey, setRefreshKey] = useState(0);

  // const handleLoginSuccess = async (credentialResponse) => {
  //   // 1. פענוח המידע מגוגל
  //   const decoded = jwtDecode(credentialResponse.credential);
  //   setUser(decoded); 
  //   setIsLoggedIn(true);

  //   // 2. חיפוש המתנדבת בדאטה-בייס לפי המייל כדי להוציא את ה-ID שלה
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/volunteers/by-email/${decoded.email}`);
  //     if (response.data) {
  //       setVolunteerId(response.data._id); // שמירת ה-ID עבור שליפת ההודעות
  //     }
  //   } catch (err) {
  //     console.log("משתמשת מחוברת, אך לא רשומה כמתנדבת במערכת");
  //   }

  //   ReactGA.event({ category: "User", action: "Login_Success" });
  // };


  const handleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    setIsLoggedIn(true);

    console.log("מתחברת עם מייל:", decoded.email); // בדיקה ב-Console

    try {
      const response = await axios.get(`http://localhost:5000/api/volunteers/by-email/${decoded.email}`);
      if (response.data && response.data._id) {
        console.log("נמצא ID מתנדבת:", response.data._id);
        setVolunteerId(response.data._id);
      }
    } catch (err) {
      console.error("שגיאה במציאת מתנדבת לפי מייל:", err.response?.data?.message || err.message);
      // אם המייל לא נמצא, ה-volunteerId יישאר null וההודעה "מתחברת..." תמשיך להופיע
    }



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
            <button onClick={() => { setIsLoggedIn(false); setVolunteerId(null); }} style={styles.logoutBtn}>התנתקות</button>
          </div>

          <h2 style={{ color: '#005f8d', textAlign: 'center' }}>ניהול מתנדבי GiveTech</h2>

          <AddVolunteer onVolunteerAdded={() => setRefreshKey(k => k + 1)} />

          <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ddd' }} />

          {/* טבלת המתנדבים */}
          <VolunteersTable key={refreshKey} />

          <hr style={{ margin: '50px 0', border: '0', borderTop: '2px dashed #eee' }} />

          {/* הצגת הודעות אישיות למתנדבת המחוברת
          {volunteerId ? (
            <MyMessages volunteerId={volunteerId} />
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>מתחברת לתיבת ההודעות שלך...</p>
          )} */}
          {/* בתוך ה-return של App.js */}
          {isLoggedIn && (
            volunteerId ? (
              <MyMessages volunteerId={volunteerId} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff3cd', borderRadius: '8px', margin: '20px' }}>
                <h3 style={{ color: '#856404' }}>המייל {user?.email} לא רשום כמתנדבת</h3>
                <p>כדי לראות הודעות, וודאי שאת רשומה בטבלה עם המייל הזה.</p>
              </div>
            )
          )}

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