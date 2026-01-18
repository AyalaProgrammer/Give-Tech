import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    Box, Table, TableBody, TableCell, TableRow, Checkbox,
    Autocomplete, TextField, Typography, Button, Dialog,
    DialogTitle, DialogContent, IconButton, TableHead
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, RefreshCw, WifiOff } from 'lucide-react'; // הוספתי WifiOff
import axios from 'axios';
import AddVolunteer from './AddVolunteer';
import ContactModal from './ContactModal';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const HELP_AREAS_LIST = [
    "עזרה והכוונה כללית למתחילות", "ייעוץ - משא ומתן חוזה / דיוני שכר",
    "ייעוץ - תכנון קריירה", "חיפוש עבודה - ג'וניוריות",
    "חיפוש עבודה - מנוסות", "ייעוץ - עבודה כפרילנסר בתכנות",
    "ייעוץ - יחסים בין אישיים בעבודה", "הכנה לראיונות פיתוח פרונטאנד", "עריכת קו\"ח"
];

const categoryMapping = {
    "עזרה והכוונה כללית למתחילות": ["מתחילות", "הכוונה", "צעד ראשון"],
    "ייעוץ - משא ומתן חוזה / דיוני שכר": ["שכר", "חוזה", "משא ומתן"],
    "ייעוץ - תכנון קריירה": ["תכנון", "קריירה"],
    "חיפוש עבודה - ג'וניוריות": ["ג'וניור", "ג'וניוריות", "junior"],
    "חיפוש עבודה - מנוסות": ["מנוסות", "סניור", "senior"],
    "עריכת קו''ח": ["קו''ח", "קורות חיים", "CV"],
    "ייעוץ - עבודה כפרילנסר בתכנות": ["פרילנס", "עצמאית"],
    "ייעוץ - יחסים בין אישיים בעבודה": ["יחסים", "בינאישי"],
    "הכנה לראיונות פיתוח פרונטאנד": ["ראיון", "פרונט", "React"]
};

const VolunteersTable = ({ user, volunteerId }) => {
    const navigate = useNavigate();
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const [selectedTechs, setSelectedTechs] = useState([]);
    const [selectedWorkplaces, setSelectedWorkplaces] = useState([]);
    const [selectedHelpAreas, setSelectedHelpAreas] = useState([]);
    const [selectedVol, setSelectedVol] = useState(null);

    const filterBoxRef = useRef(null);
    const commonFont = { fontFamily: '"Assistant", "Segoe UI", Arial, sans-serif' };
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const isXsSmall = useMediaQuery('(max-width:390px)');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('http://localhost:5000/api/volunteers');
            setVolunteers(res.data || []);
        } catch (err) {
            setError(err.message === "Network Error" ? "חוסר חיבור לרשת" : "השרת אינו מגיב");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const allTechnologies = useMemo(() => [...new Set(volunteers.flatMap(v => v.technologies || []))].sort(), [volunteers]);
    const allWorkplaces = useMemo(() => [...new Set(volunteers.map(v => v.workPlace))].filter(Boolean).sort(), [volunteers]);

    const filteredVolunteers = useMemo(() => {
        return volunteers.filter(vol => {
            const matchesTech = selectedTechs.length === 0 || (vol.technologies && vol.technologies.some(t => selectedTechs.includes(t)));
            const matchesWorkplace = selectedWorkplaces.length === 0 || selectedWorkplaces.includes(vol.workPlace);
            const matchesHelpArea = selectedHelpAreas.length === 0 || selectedHelpAreas.some(title => {
                const keywords = categoryMapping[title] || [title];
                return keywords.some(k => vol.helpArea?.toLowerCase().includes(k.toLowerCase()));
            });
            return matchesTech && matchesWorkplace && matchesHelpArea;
        });
    }, [volunteers, selectedTechs, selectedWorkplaces, selectedHelpAreas]);

    // מצב טעינה
    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center', ...commonFont }}>
            <Box className="chasing-loader" sx={{ mb: 4 }}></Box>
            <Typography variant="h5" sx={{ color: '#00436d', fontWeight: 'bold' }}>מכינים עבורך את רשימת המתנדבות...</Typography>
            <style>{`.chasing-loader { width: 65px; height: 65px; border-radius: 50%; background: conic-gradient(#0000 10%, #008fbb, #00436d); mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0); animation: spin 0.8s infinite linear; } @keyframes spin { to { transform: rotate(1turn); } }`}</style>
        </Box>
    );

    // מסך שגיאה מעוצב עם אייקון "אין קליטה"
    if (error) return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f7f9', p: 3 }}>
            <Box sx={{ backgroundColor: '#fff', p: { xs: 4, md: 6 }, borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', textAlign: 'center', maxWidth: '500px' }}>
                <Box sx={{
                    width: '80px', height: '80px',
                    backgroundColor: '#f0f4f8', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', border: '2px solid #d1d9e0'
                }}>
                    <WifiOff size={40} color="#595959" />
                </Box>
                <Typography variant="h5" sx={{ color: '#00436d', fontWeight: '800', mb: 2, ...commonFont }}>אופס! אין חיבור לשרת</Typography>
                <Typography sx={{ color: '#595959', mb: 4, lineHeight: 1.6, ...commonFont }}>
                    {error === "חוסר חיבור לרשת" ? "נראה שאין חיבור לאינטרנט כרגע. בדקי את החיבור וניסי שוב." : "לא הצלחנו לתקשר עם השרת. ייתכן והוא בתחזוקה."}
                </Typography>
                <Button
                    variant="contained"
                    onClick={fetchData}
                    startIcon={<RefreshCw size={18} style={{ marginLeft: '8px' }} />}
                    sx={{
                        backgroundColor: '#00436d', borderRadius: '30px', px: 5, py: 1.5,
                        fontWeight: '700', ...commonFont, '&:hover': { backgroundColor: '#002b46' }
                    }}
                >
                    נסה שוב
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box className="fade-in main-container-font" sx={{
            width: '100%', direction: 'rtl', height: '100vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            backgroundColor: '#f4f7f9'
        }}>

            {/* Header */}
            <Box sx={{
                px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 1,
                display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' },
                backgroundColor: '#fff', gap: { xs: 2, sm: 0 }
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '24px', md: '32px' }, color: '#00436d', ...commonFont }}>
                        רשימת מתנדבות GiveTech
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 0.5, ...commonFont }}>
                        מצאי את המלווה המתאימה עבורך מתוך קהילת המומחיות שלנו
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box sx={{ textAlign: 'center', cursor: 'pointer' }}>
                            <MessageSquare size={22} color="#00436d" />
                            <Typography sx={{ fontSize: '0.65rem', color: '#00436d' }}>הפניות שלי</Typography>
                        </Box>
                        {volunteerId && (
                            <Box onClick={() => navigate('/inbox')} sx={{ textAlign: 'center', cursor: 'pointer' }}>
                                <Mail size={22} color="#00436d" />
                                <Typography sx={{ fontSize: '0.65rem', color: '#00436d' }}>דואר נכנס</Typography>
                            </Box>
                        )}
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon sx={{ ml: 1, mr: 0 }} />}
                        onClick={() => setOpenModal(true)}
                        sx={{
                            ...commonFont, backgroundColor: '#007bb5', borderRadius: '25px', fontWeight: '700', px: 3,
                            width: { xs: '100%', sm: 'auto' }, boxShadow: '0 4px 10px rgba(0,123,181,0.2)',
                            '&:hover': { backgroundColor: '#005f8d' }
                        }}
                    >
                        {isXsSmall ? 'הוספה' : 'הוספת מתנדבת'}
                    </Button>

                </Box>
            </Box>

            {/* Filters Section */}
            <Box
                ref={filterBoxRef}
                sx={{
                    position: 'sticky', top: 0, zIndex: 1100, backgroundColor: '#fff',
                    p: { xs: 2, md: 3 }, borderBottom: '1px solid #e0e0e0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', boxSizing: 'border-box',
                    display: 'flex', flexDirection: 'column', gap: 2
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FilterListIcon sx={{ color: '#00436d' }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#00436d', ...commonFont }}>
                            {isXsSmall ? 'סינון' : 'סינון מתנדבות'}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', width: '100%' }}>
                    {[
                        { label: "מקום עבודה", options: allWorkplaces, value: selectedWorkplaces, setter: setSelectedWorkplaces },
                        { label: "טכנולוגיות", options: allTechnologies, value: selectedTechs, setter: setSelectedTechs },
                        { label: "תחום עזרה", options: HELP_AREAS_LIST, value: selectedHelpAreas, setter: setSelectedHelpAreas }
                    ].map((filter, index) => (
                        <Autocomplete
                            key={index}
                            multiple
                            options={filter.options}
                            value={filter.value}
                            onChange={(e, val) => filter.setter(val)}
                            disableCloseOnSelect
                            renderTags={() => null}
                            sx={{
                                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1' },
                                direction: 'rtl',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px', backgroundColor: '#f8fafc', paddingRight: '12px !important',
                                    '& .MuiAutocomplete-endAdornment': { right: 'auto !important', left: '8px !important' }
                                },
                                '& .MuiInputLabel-root': { right: '25px', left: 'auto', transformOrigin: 'right', ...commonFont },
                                '& .MuiOutlinedInput-notchedOutline': { textAlign: 'right' }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={filter.value.length > 0 ? `${filter.label} (${filter.value.length})` : filter.label}
                                    size="small"
                                    placeholder={filter.value.length === 0 ? "בחרי..." : ""}
                                    inputProps={{ ...params.inputProps, style: { textAlign: 'right', ...commonFont } }}
                                />
                            )}
                            renderOption={(props, option, { selected }) => (
                                <li {...props} style={{ direction: 'rtl', ...commonFont, fontSize: '0.9rem', textAlign: 'right' }}>
                                    <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} sx={{ ml: 1, mr: -1, color: '#007bb5' }} />
                                    {option}
                                </li>
                            )}
                        />
                    ))}
                    {(selectedWorkplaces.length > 0 || selectedTechs.length > 0 || selectedHelpAreas.length > 0) && (
                        <Button size="small" onClick={() => { setSelectedWorkplaces([]); setSelectedTechs([]); setSelectedHelpAreas([]); }} sx={{ ...commonFont, color: '#666', fontSize: '0.8rem', textDecoration: 'underline' }}>ניקוי הכל</Button>
                    )}
                </Box>
            </Box>

            {/* Table Section */}
            <Box sx={{ flex: 1, overflowY: 'auto', backgroundColor: 'white' }}>
                <Table stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ ...headerStyle, width: '12%' }}>שם</TableCell>
                            <TableCell sx={{ ...headerStyle, width: '28%' }}>תחום עזרה</TableCell>
                            <TableCell sx={{ ...headerStyle, width: '15%' }}>מקום עבודה</TableCell>
                            <TableCell sx={{ ...headerStyle, width: '33%' }}>טכנולוגיות</TableCell>
                            <TableCell sx={{ ...headerStyle, width: '12%' }}>פעולות</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVolunteers.length > 0 ? (
                            filteredVolunteers.map((vol) => (
                                <TableRow key={vol._id} hover>
                                    <TableCell sx={{ ...cellStyle, fontWeight: '700' }}>{vol.fullName}</TableCell>
                                    <TableCell sx={cellStyle}>{vol.helpArea}</TableCell>
                                    <TableCell sx={cellStyle}>{vol.workPlace}</TableCell>
                                    <TableCell sx={cellStyle}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                            {vol.technologies?.map((tech, index) => (
                                                <Box key={index} sx={techBadgeStyle}>{tech}</Box>
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={cellStyle}>
                                        <Button
                                            size="small" variant="contained"
                                            sx={{
                                                borderRadius: '15px', boxShadow: 'none', fontSize: '0.75rem',
                                                backgroundColor: '#007bb5', whiteSpace: 'nowrap', px: 2,
                                                '&:hover': { backgroundColor: '#005f8d' }
                                            }}
                                            onClick={() => setSelectedVol(vol)}
                                        >
                                            צור קשר
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 10 }}>
                                    <Typography variant="h6" color="textSecondary" sx={commonFont}>לא נמצאו מתנדבות התואמות את הסינון.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>

            {/* Modals */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth sx={{ direction: 'rtl' }}>
                <DialogTitle sx={{ ...commonFont, fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    הוספת מתנדבת חדשה
                    <IconButton onClick={() => setOpenModal(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <AddVolunteer onClose={() => setOpenModal(false)} onRefresh={fetchData} />
                </DialogContent>
            </Dialog>

            <ContactModal isOpen={!!selectedVol} onClose={() => setSelectedVol(null)} volunteer={selectedVol} />
        </Box>
    );
};

// Styles
const headerStyle = {
    backgroundColor: '#005f8d',
    color: 'white !important',
    fontWeight: 'bold',
    padding: '12px',
    fontSize: '0.9rem',
    textAlign: 'right',
    fontFamily: '"Assistant", sans-serif'
};

const cellStyle = {
    padding: '12px',
    borderBottom: '1px solid #eee',
    fontSize: '0.85rem',
    textAlign: 'right',
    fontFamily: '"Assistant", sans-serif',
    verticalAlign: 'middle',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere'
};

const techBadgeStyle = {
    backgroundColor: '#f0f4f8',
    color: '#005f8d',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid #d1d9e0',
    lineHeight: '1.2',
    display: 'inline-block'
};

export default VolunteersTable;