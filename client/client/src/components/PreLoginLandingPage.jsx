import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container, Paper, Stack, AppBar, Toolbar } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SchoolIcon from '@mui/icons-material/School'; // למידה
import Diversity3Icon from '@mui/icons-material/Diversity3'; // קהילת נשים
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'; // אייקון של נתינה/לב

const PreLoginLandingPage = () => {
    const navigate = useNavigate();
    const commonFont = { fontFamily: '"Assistant", "Segoe UI", Arial, sans-serif' };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                ...commonFont,
            }}
        >
            <AppBar
                position="sticky"
                elevation={0}
            >
            </AppBar>

            <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 8, md: 5 } }}>
                <Box sx={{ width: '100%', animation: 'fadeIn 0.8s ease-out' }}>

                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2, py: 0.5,
                            borderRadius: '20px',
                            bgcolor: 'rgba(0, 122, 255, 0.1)',
                            color: '#007AFF',
                            mb: 4
                        }}>
                            <RocketLaunchIcon sx={{ fontSize: 18 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>עוצמה טכנולוגית</Typography>
                        </Box>

                        <Typography
                            variant="h1"
                            sx={{
                                ...commonFont,
                                fontWeight: 900,
                                color: '#0F172A',
                                mb: 3,
                                fontSize: { xs: '2.8rem', md: '4.5rem' },
                                lineHeight: 1.1,
                                direction: 'rtl',
                            }}
                        >
                           <span style={{ color: '#007AFF' }}>נתינה</span> טכנולוגית פורצת דרך
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                ...commonFont,
                                color: '#64748B',
                                mb: 6,
                                maxWidth: '900px',
                                mx: 'auto',
                                lineHeight: 1.6,
                                direction: 'rtl',
                                fontWeight: 400
                            }}
                        >
                            קהילת ההייטק לתרומה חברתית.<br />
                            מחברים בין המוחות המבריקים ביותר לבין האתגרים הטכנולוגיים של המעוניינים בסיוע מקצועי.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/login")}
                            sx={{
                                ...commonFont,
                                bgcolor: '#007AFF',
                                color: 'white',
                                px: 8, py: 2,
                                fontSize: '1.25rem',
                                borderRadius: '16px',
                                fontWeight: 800,
                                '&:hover': { bgcolor: '#005BBF', transform: 'scale(1.02)' },
                                transition: 'all 0.2s ease',
                                boxShadow: '0 10px 30px rgba(0, 122, 255, 0.3)'
                            }}
                        >
                            התחילו עכשיו
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                            gap: 4,
                            direction: 'rtl',
                        }}
                    >
                        {[
                            {
                                icon: <Diversity3Icon />,
                                title: "מאגר מתנדבות",
                                desc: "רשימה הולכת וגדלה של נשים מכל תחומי ההייטק - פיתוח, מוצר, דאטה ועיצוב - שזמינות עבורך."
                            },
                            {
                                icon: <VolunteerActivismIcon />,
                                title: "ליווי אישי",
                                desc: "עזרה בפתרון בעיות טכנולוגיות, הכנה לראיונות עבודה או התייעצות על קריירה בסביבה תומכת."
                            },
                            {
                                icon: <SchoolIcon />,
                                title: "העברת ידע",
                                desc: "למידה משותפת והנגשת כלים טכנולוגיים כדי להבטיח שאף אחת לא נשארת מאחור."
                            }
                        ].map((feature, idx) => (
                            <Paper
                                key={idx}
                                elevation={0}
                                sx={{
                                    p: 5,
                                    borderRadius: '30px',
                                    textAlign: 'center',
                                    border: '1px solid #E2E8F0',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                                        borderColor: '#007AFF'
                                    }
                                }}
                            >
                                <Box sx={{
                                    mb: 3,
                                    display: 'inline-flex',
                                    p: 2,
                                    borderRadius: '20px',
                                    bgcolor: '#F1F5F9',
                                    color: '#007AFF'
                                }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h5" sx={{ ...commonFont, fontWeight: 800, mb: 2, color: '#1E293B' }}>
                                    {feature.title}
                                </Typography>
                                <Typography sx={{ ...commonFont, color: '#64748B', lineHeight: 1.7 }}>
                                    {feature.desc}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            </Container>

            <Box sx={{ py: 2, textAlign: 'center', borderTop: '1px solid #E2E8F0', bgcolor: 'white' }}>
                <Typography variant="body2" sx={{ ...commonFont, color: '#94A3B8', fontWeight: 600 }}>
                    © 2026 GiveTech Platform • כל זכויות שמורות
                </Typography>
            </Box>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </Box>
    );
};

export default PreLoginLandingPage;