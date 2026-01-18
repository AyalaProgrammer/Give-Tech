import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import ReactGA from "react-ga4"

import {
  CircularProgress,
  Box,
  CssBaseline,
} from "@mui/material"

import HomeInfoPage from "./components/Home"
import Login from "./components/Login"
import VolunteersTable from "./components/VolunteersTable"
import Header from "./components/Header"
import PreLoginLandingPage from "./components/PreLoginLandingPage"
import LandingHeader from "./components/HeaderOutside"
import MyMessages from "./components/MyMessages"
import "./App.css"

ReactGA.initialize("G-HJ69XTBX9V")

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  const volunteerId = user?.sub;

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const decoded = JSON.parse(savedUser)
        setUser(decoded)
        setIsLoggedIn(true)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsCheckingAuth(false)
  }, [])

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential)
    setUser(decoded)
    setIsLoggedIn(true)
    localStorage.setItem("user", JSON.stringify(decoded))
    ReactGA.event({ category: "User", action: "Login_Success" })
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
    setImgLoaded(false);
    ReactGA.event({ category: "User", action: "Logout" });
  }

  if (isCheckingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F8FAFC' }}>
        <CircularProgress sx={{ color: '#007AFF' }} />
      </Box>
    )
  }

  return (
    <GoogleOAuthProvider clientId="973582819268-hsc8eh347h9m7qumtb2t3f2vcoffp8ph.apps.googleusercontent.com">
      <Router>
        <CssBaseline />
        {!isLoggedIn ? (
          <Box sx={{ padding: "20px", direction: "rtl", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
            <LandingHeader
              user={user}
              imgLoaded={imgLoaded}
              setImgLoaded={setImgLoaded}
              onLogout={handleLogout}
            />
            <Routes>
              <Route path="/" element={<PreLoginLandingPage />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        ) : (
          <Box sx={{ direction: "rtl", minHeight: "100vh", backgroundColor: "#f4f7f9" }}>
            <Header
              user={user}
              imgLoaded={imgLoaded}
              setImgLoaded={setImgLoaded}
              onLogout={handleLogout}
            />

            <main>
              <Routes>
                <Route path="/volunteersTable" element={
                  <Box sx={{ p: { xs: 1, md: 0 } }}>
                    <VolunteersTable
                      key={refreshKey}
                      user={user}
                      volunteerId={volunteerId}
                    />
                  </Box>
                } />

                <Route path="/home" element={<HomeInfoPage />} />
                <Route path="/inbox" element={<MyMessages volunteerId={volunteerId} />} />

                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </main>
          </Box>
        )}
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App;