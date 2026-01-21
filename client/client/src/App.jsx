import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshMessagesCount = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/unread-count/${id}`);
      const count = res.data && typeof res.data.count !== 'undefined' ? res.data.count : 0;
      setUnreadCount(count);
    } catch (err) {
      console.error("❌ Error fetching count:", err);
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
        refreshMessagesCount(response.data._id);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!volunteerId) return;
    socket.emit('join', volunteerId);

    const handleNewMessage = (data) => {
      if (data.receiverId === volunteerId) {
        refreshMessagesCount(volunteerId);
      }
    };

    const handleRead = (data) => {
      if (data.receiverId === volunteerId) {
        refreshMessagesCount(volunteerId);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_marked_read', handleRead);

    return () => {
      socket.off('new_message');
      socket.off('messages_marked_read');
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
            <Box>
        
              <Box sx={styles.headerBar}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={user?.picture} alt="user" style={{ width: '40px', borderRadius: '50%' }} />
                  <Typography>שלום, <strong>{user?.name}</strong></Typography>
                </Box>
                <Button variant="outlined" color="error" size="small" onClick={() => window.location.reload()}>
                  התנתקות
                </Button>
              </Box>

              <Routes>
                <Route path="/" element={
                  <Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" sx={{ color: '#005f8d', fontWeight: 'bold' }}>
                          ניהול מתנדבי GiveTech
                        </Typography>
                    </Box>
                    
                    {volunteerId && <AddVolunteer onVolunteerAdded={() => setRefreshKey(k => k + 1)} />}
                    <Divider sx={{ my: 4 }} />
                    
                
                    <VolunteersTable 
                      key={refreshKey} 
                      user={user} 
                      volunteerId={volunteerId} 
                      unreadCount={unreadCount} 
                    />
                  </Box>
                } />
                <Route path="/inbox" element={<MyMessages volunteerId={volunteerId} user={user} />} />
              </Routes>
            </Box>
          )}
        </Box>
      </Router>
    </GoogleOAuthProvider>
  );
}

const styles = {
  headerBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', padding: '10px 20px', borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '20px'
  }
};

export default App;