import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Stack, AppBar, Toolbar, Box } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const LandingHeader = () => {
    const navigate = useNavigate();
    const commonFont = { fontFamily: '"Assistant", "Segoe UI", Arial, sans-serif' };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                top: 0,
                zIndex: 1100,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                color: 'inherit'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 1,
                        // כפיית כיוון משמאל לימין כדי שהלוגו יהיה ראשון משמאל
                        direction: 'ltr'
                    }}
                >

                    {/* צד שמאל: הלוגו (מופיע ראשון בגלל ה-ltr) */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        onClick={() => navigate("/")}
                        sx={{ cursor: 'pointer' }}
                    >
                        <AutoAwesomeIcon sx={{ color: '#007AFF', fontSize: 28 }} />
                        <Typography variant="h5" sx={{ ...commonFont, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.5px' }}>
                            GiveTech
                        </Typography>
                    </Stack>

                    {/* צד ימין: כפתור כניסה (מופיע אחרון בגלל ה-ltr) */}
                    <Button
                        variant="contained"
                        onClick={() => navigate("/login")}
                        sx={{
                            ...commonFont,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 4,
                            bgcolor: '#1E293B',
                            '&:hover': { bgcolor: '#0F172A' },
                            // מחזיר את כיוון הטקסט בתוך הכפתור לעברית תקינה
                            direction: 'rtl'
                        }}
                    >
                        כניסה למערכת
                    </Button>

                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default LandingHeader;