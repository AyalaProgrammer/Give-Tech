import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Box, Typography, Button, Divider, CssBaseline } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

import Login from './components/Login';
import VolunteersTable from './components/VolunteersTable';
import AddVolunteer from './components/AddVolunteer';
import MyMessages from './components/MyMessages';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [volunteerId, setVolunteerId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    setIsLoggedIn(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/volunteers/by-email/${decoded.email}`);
      if (response.data && response.data._id) setVolunteerId(response.data._id);
    } catch (err) { console.error("לא נמצא ID למתנדבת"); }
  };

  return (
    <GoogleOAuthProvider clientId="973582819268-hsc8eh347h9m7qumtb2t3f2vcoffp8ph.apps.googleusercontent.com">
      <Router>
        <CssBaseline />
        <Box sx={{ backgroundColor: '#f4f7f9', minHeight: '100vh', direction: 'rtl', p: 2 }}>
          {!isLoggedIn ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Routes>
              {/* דף הבית - רחב ורגיל לגמרי */}
              <Route path="/" element={
                <Box>
                  <Box sx={styles.headerBar}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={user?.picture} alt="user" style={{ width: '40px', borderRadius: '50%' }} />
                      <Typography>שלום, <strong>{user?.name}</strong></Typography>
                    </Box>
                    <Button variant="contained" color="error" onClick={() => setIsLoggedIn(false)}>התנתקות</Button>
                  </Box>
                  <Typography variant="h4" align="center" sx={{ color: '#005f8d', mb: 4, fontWeight: 'bold' }}>ניהול מתנדבי GiveTech</Typography>
                  <AddVolunteer onVolunteerAdded={() => setRefreshKey(k => k + 1)} />
                  <Divider sx={{ my: 4 }} />
                  <VolunteersTable key={refreshKey} user={user} volunteerId={volunteerId} />
                </Box>
              } />

              {/* דף הודעות - פשוט קורא לקומפוננטה */}
              <Route path="/inbox" element={<MyMessages volunteerId={volunteerId} />} />
            </Routes>
          )}
        </Box>
      </Router>
    </GoogleOAuthProvider>
  );
}

const styles = {
  headerBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '10px 20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }
};

export default App;