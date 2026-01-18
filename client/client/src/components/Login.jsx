import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    CircularProgress,
    Stack,
    Fade
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function Login({ onLoginSuccess }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const commonFont = { fontFamily: '"Assistant", "Segoe UI", Arial, sans-serif' };

    const handleSuccess = (response) => {
        setLoading(true);
        // דימוי בדיקת שרת קצרה לחוויית משתמש חלקה
        setTimeout(() => {
            onLoginSuccess(response);
            setLoading(false);
            navigate('/home');
        }, 1000);
    };

    return (
        <Box
            sx={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F8FAFC', // רקע תואם ל-Landing Page
                p: 1
            }}
        >
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        width: '100%',
                        maxWidth: '450px',
                        borderRadius: '32px',
                        border: '1px solid #E2E8F0',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
                    }}
                >
                    {/* Header הלוגו המקורי */}
                    <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
                        <Box sx={{
                            bgcolor: 'rgba(0, 122, 255, 0.1)',
                            p: 1.5,
                            borderRadius: '16px',
                            display: 'flex'
                        }}>
                            <AutoAwesomeIcon sx={{ color: '#007AFF', fontSize: 32 }} />
                        </Box>
                        <Typography variant="h4" sx={{ ...commonFont, fontWeight: 900, color: '#1E293B' }}>
                            GiveTech
                        </Typography>
                        <Typography sx={{ ...commonFont, color: '#64748B', fontWeight: 500 }}>
                            פלטפורמה חכמה לחיבור מתנדבים
                        </Typography>
                    </Stack>

                    <Box sx={{ minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {loading ? (
                            <Stack alignItems="center" spacing={2} sx={{ animation: 'fadeIn 0.5s' }}>
                                <CircularProgress size={40} sx={{ color: '#007AFF' }} />
                                <Typography sx={{ ...commonFont, color: '#1E293B', fontWeight: 600 }}>
                                    מאמת נתונים...
                                </Typography>
                            </Stack>
                        ) : (
                            <Box>
                                <Typography sx={{ ...commonFont, mb: 4, color: '#475569', fontSize: '1.1rem' }}>
                                    ברוך הבא! התחבר כדי להתחיל
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    '& iframe': { transform: 'scale(1.1)' } // הגדלה קלה של הכפתור
                                }}>
                                    <GoogleLogin
                                        onSuccess={handleSuccess}
                                        onError={() => console.log('Login Failed')}
                                        useOneTap // מאפשר התחברות מהירה אם המשתמש כבר מחובר בדפדפן
                                        ux_mode="popup" // גוגל ממליצה על popup, להלן הסבר על redirect
                                        theme="filled_blue"
                                        shape="pill"
                                        size="large"
                                        width="250px"
                                        text="signin_with"
                                    />
                                </Box>
                                <Typography sx={{ ...commonFont, mt: 3, fontSize: '0.85rem', color: '#94A3B8' }}>
                                    ההתחברות מאובטחת באמצעות Google Cloud
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #F1F5F9' }}>
                        <Typography sx={{ ...commonFont, fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                            © 2026 GiveTech Platform
                        </Typography>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
}

export default Login;