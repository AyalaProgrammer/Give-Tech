import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = (response) => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(response);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="brand-logo">GiveTech</h1>
          <p className="brand-tagline">פלטפורמה חכמה לניהול מתנדבים</p>
        </div>

        {loading ? (
          <div className="loader-wrapper">
            <div className="modern-spinner"></div>
            <p>מאמת נתונים...</p>
          </div>
        ) : (
          <div className="auth-section">
            <p className="welcome-text">ברוכה הבאה! התחברי כדי להתחיל</p>
            <div className="google-btn-wrapper">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
                shape="pill"
                theme="filled_blue"
                size="large"
                text="signin_with"
              />
            </div>
          </div>
        )}
        
        <div className="login-footer">
          <p>© 2026 GiveTech Platform</p>
        </div>
      </div>
    </div>
  );
}

export default Login;