import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import ReactGA from "react-ga4"
import { CircularProgress, Box } from "@mui/material" // הוספת רכיב טעינה

import Login from "./components/Login"
import VolunteersTable from "./components/VolunteersTable"
import AddVolunteer from "./components/AddVolunteer"
import HomeInfoPage from "./components/Home"
import Header from "./components/Header"
import PreLoginLandingPage from "./components/PreLoginLandingPage"
import "./App.css"
import LandingHeader from "./components/HeaderOutside"

ReactGA.initialize("G-HJ69XTBX9V")

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true) // מונע קפיצה לדף הבית ברענון
  const [refreshKey, setRefreshKey] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    // בדיקה ראשונית של המשתמש ב-LocalStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setIsLoggedIn(true)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
      }
    }
    // ברגע שהבדיקה הסתיימה, משחררים את חסימת הרינדור
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
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem("user")
    setImgLoaded(false)
    ReactGA.event({ category: "User", action: "Logout" })
  }

  // בזמן הבדיקה, נציג מסך טעינה נקי בצבעי המותג
  if (isCheckingAuth) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#F8FAFC'
        }}
      >
        <CircularProgress sx={{ color: '#007AFF' }} />
      </Box>
    )
  }

  return (
    <GoogleOAuthProvider clientId="973582819268-hsc8eh347h9m7qumtb2t3f2vcoffp8ph.apps.googleusercontent.com">
      <Router>
        {!isLoggedIn ? (
          /* נתיבים למשתמש לא מחובר */
          <div style={{ padding: "20px", direction: "rtl", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
            <LandingHeader
              user={user}
              imgLoaded={imgLoaded}
              setImgLoaded={setImgLoaded}
              onLogout={handleLogout}
            />
            <Routes>
              <Route path="/" element={<PreLoginLandingPage />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              {/* אם המשתמש לא מחובר ומנסה להגיע לכל דף אחר - הפניה לדף הנחיתה */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        ) : (
          /* נתיבים למשתמש מחובר */
          <div style={{ padding: "20px", direction: "rtl", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
            <Header
              user={user}
              imgLoaded={imgLoaded}
              setImgLoaded={setImgLoaded}
              onLogout={handleLogout}
            />

            <main role="main" style={{ marginTop: "20px" }}>
              <Routes>
                {/* כאן ה-Routes נשמרים ברענון כי isLoggedIn כבר true */}
                <Route path="/home" element={<HomeInfoPage />} />
                <Route path="/add" element={<AddVolunteer onVolunteerAdded={() => setRefreshKey((k) => k + 1)} />} />
                <Route path="/list" element={<VolunteersTable key={refreshKey} />} />

                {/* אם המשתמש מחובר ובטעות הגיע ל-URL לא קיים או לדף הנחיתה - הפניה ל-Home המחובר */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </main>
          </div>
        )}
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App