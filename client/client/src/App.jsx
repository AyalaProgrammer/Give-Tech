import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Box, Typography, Button, Divider, CssBaseline } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { io } from 'socket.io-client';

import Login from './components/Login';
import VolunteersTable from './components/VolunteersTable';
import AddVolunteer from './components/AddVolunteer';
import MyMessages from './components/MyMessages';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [volunteerId, setVolunteerId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // פונקציה למשיכת המונה מהשרת
  const refreshMessagesCount = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/unread-count/${id}`);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error("שגיאה במשיכת מספר הודעות", err);
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    setIsLoggedIn(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/volunteers/by-email/${decoded.email}`);
      if (response.data && response.data._id) {
        setVolunteerId(response.data._id);
      }
    } catch (err) { console.error("לא נמצא ID למתנדבת"); }
  };

  useEffect(() => {
    if (!volunteerId) return;

    // משיכה ראשונית
    refreshMessagesCount(volunteerId);

    // האזנה לעדכונים בלייב
    const handleUpdate = (data) => {
        // אם העדכון קשור אלי (אני המקבלת), נרענן את המונה
        if (!data.receiverId || data.receiverId === volunteerId) {
            refreshMessagesCount(volunteerId);
        }
    };

    socket.on('new_message', handleUpdate);
    socket.on('message_read_update', handleUpdate);

    return () => {
      socket.off('new_message');
      socket.off('message_read_update');
    };
  }, [volunteerId, refreshMessagesCount]);

  return (
    <GoogleOAuthProvider clientId="973582819268-hsc8eh347h9m7qumtb2t3f2vcoffp8ph.apps.googleusercontent.com">
      <Router>
        <CssBaseline />
        <Box sx={{ backgroundColor: '#f4f7f9', minHeight: '100vh', direction: 'rtl', p: 2 }}>
          {!isLoggedIn ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Routes>
              <Route path="/" element={
                <Box>
                  <Box sx={styles.headerBar}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={user?.picture} alt="user" style={{ width: '40px', borderRadius: '50%' }} />
                      <Typography>שלום, <strong>{user?.name}</strong></Typography>
                    </Box>
                    <Button variant="contained" color="error" onClick={() => { setIsLoggedIn(false); setVolunteerId(null); }}>התנתקות</Button>
                  </Box>
                  <Typography variant="h4" align="center" sx={{ color: '#005f8d', mb: 4, fontWeight: 'bold' }}>ניהול מתנדבי GiveTech</Typography>
                  <AddVolunteer onVolunteerAdded={() => setRefreshKey(k => k + 1)} />
                  <Divider sx={{ my: 4 }} />
                  <VolunteersTable 
                    key={refreshKey} 
                    user={user} 
                    volunteerId={volunteerId} 
                    unreadCount={unreadCount} 
                  />
                </Box>
              } />
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