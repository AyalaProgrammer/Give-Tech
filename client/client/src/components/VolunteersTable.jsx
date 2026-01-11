import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Box, Table, TableBody, TableCell, TableRow, Checkbox,
    Autocomplete, TextField, Typography, Button, Dialog,
    DialogTitle, DialogContent, IconButton, TableHead
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import AddVolunteer from './AddVolunteer';
import { useMediaQuery } from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// שינוי לערכים מספריים כדי לאפשר חישובים
const GLOBAL_NAV_HEIGHT = { xs: 168, md: 62 };

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
    "חיפוש עבודה - ג'וניוריות": ["ג'וניור", "junior"],
    "חיפוש עבודה - מנוסות": ["מנוסות", "senior"],
    "עריכת קו''ח": ["קו''ח", "קורות חיים", "CV"],
    "ייעוץ - עבודה כפרילנסר בתכנות": ["פרילנס", "freelance"],
    "ייעוץ - יחסים בין אישיים בעבודה": ["יחסים", "צוות"],
    "הכנה לראיונות פיתוח פרונטאנד": ["ראיון", "React", "Frontend"]
};

const VolunteersTable = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const [selectedTechs, setSelectedTechs] = useState([]);
    const [selectedWorkplaces, setSelectedWorkplaces] = useState([]);
    const [selectedHelpAreas, setSelectedHelpAreas] = useState([]);

    const filterBoxRef = useRef(null);
    const [filterHeight, setFilterHeight] = useState(0);

    const commonFont = { fontFamily: '"Assistant", "Segoe UI", Arial, sans-serif' };
    const isXsSmall = useMediaQuery('(max-width:390px)');

    const fetchData = async () => {
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
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        if (filterBoxRef.current) {
            setFilterHeight(filterBoxRef.current.offsetHeight);
        }
    }, [selectedTechs, selectedWorkplaces, selectedHelpAreas, volunteers]);

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

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center', ...commonFont }}>
            <Box className="chasing-loader" sx={{ mb: 4 }}></Box>
            <Typography variant="h5" sx={{ color: 'var(--primary-dark)', fontWeight: 'bold' }}>מכינים עבורך את רשימת המתנדבות...</Typography>
            <style>{`.chasing-loader { width: 65px; height: 65px; border-radius: 50%; background: conic-gradient(#0000 10%, #008fbb, #00436d); mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0); animation: spin 0.8s infinite linear; } @keyframes spin { to { transform: rotate(1turn); } }`}</style>
        </Box>
    );

    return (
        <Box className="fade-in main-container-font" sx={{ width: '100%', direction: 'rtl' }}>
            <Typography variant="h4" className="title" sx={{ mb: 3, px: 2, fontWeight: 800, fontSize: '30px', color: 'var(--primary-dark)', ...commonFont }}>רשימת מתנדבות GiveTech</Typography>

            <Box
                ref={filterBoxRef}
                sx={{
                    position: 'sticky',
                    top: { xs: `${GLOBAL_NAV_HEIGHT.xs}px`, md: `${GLOBAL_NAV_HEIGHT.md}px` },
                    zIndex: 1100,
                    backgroundColor: '#fff',
                    p: { xs: 1.5, md: 2 },
                    borderBottom: '1px solid var(--border-light)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-dark)' }}>
                        <FilterListIcon />
                        <Typography variant="h6" sx={{ fontWeight: 700, ...commonFont }}>
                            {isXsSmall ? 'סינון' : 'סינון מתנדבות'}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon sx={{ ml: 1 }} />}
                        onClick={() => setOpenModal(true)}
                        sx={{ ...commonFont, backgroundColor: 'var(--primary-dark)', borderRadius: '20px', fontWeight: '700' }}
                    >
                        {isXsSmall ? 'הוספה' : 'הוספת מתנדבת'}
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
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
                            sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33% - 10px)' } }}
                            renderInput={(params) => (
                                <TextField {...params} label={filter.value.length > 0 ? `${filter.label} (${filter.value.length})` : filter.label} size="small" />
                            )}
                            renderOption={(props, option, { selected }) => (
                                <li {...props} style={{ direction: 'rtl', ...commonFont }}><Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />{option}</li>
                            )}
                        />
                    ))}
                </Box>
            </Box>

            <Box sx={{ width: '100%', WebkitOverflowScrolling: 'touch' }}>
                <Table stickyHeader sx={{
                    tableLayout: 'fixed',
                    minWidth: '1000px',
                    width: '100%'
                }}>
                    <TableHead>
                        <TableRow>
                            {[
                                { label: 'שם', w: '10%' },
                                { label: 'תחום עזרה', w: '20%' },
                                { label: 'וותק', w: '8%' },
                                { label: 'תחום ניסיון', w: '12%' },
                                { label: 'טכנולוגיות', w: '15%' },
                                { label: 'מקום עבודה', w: '10%' },
                                { label: 'פרטי קשר', w: '12%' },
                                { label: 'הערות', w: '13%' }
                            ].map((col) => (
                                <TableCell
                                    key={col.label}
                                    sx={{
                                        ...headerStyle,
                                        ...commonFont,
                                        width: col.w,
                                        backgroundColor: 'var(--primary-dark) !important',
                                        color: 'white !important',
                                        position: 'sticky',
                                        zIndex: 1050,
                                        top: {
                                            xs: `${GLOBAL_NAV_HEIGHT.xs + filterHeight + 94}px`,
                                            sm: `${GLOBAL_NAV_HEIGHT.xs + filterHeight - 7}px`,
                                            md: `${GLOBAL_NAV_HEIGHT.md + filterHeight}px`
                                        },
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVolunteers.length > 0 ? (
                            filteredVolunteers.map((vol) => (
                                <TableRow key={vol._id} hover>
                                    <TableCell sx={{ ...cellStyle, ...commonFont, fontWeight: '700' }}>{vol.fullName}</TableCell>
                                    <TableCell sx={{ ...cellStyle, ...commonFont }}>{vol.helpArea}</TableCell>
                                    <TableCell sx={{ ...cellStyle, ...commonFont }}>{vol.seniority} ש'</TableCell>
                                    <TableCell sx={{ ...cellStyle, ...commonFont }}>{vol.experienceArea}</TableCell>
                                    <TableCell sx={{ ...cellStyle, ...commonFont }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {vol.technologies?.map((t, i) => (
                                                <span key={i} className="tech-badge">
                                                    {t}
                                                </span>
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyle, ...commonFont }}>{vol.workPlace}</TableCell>
                                    <TableCell sx={{ ...cellStyle, ...commonFont, color: 'var(--primary-dark)', fontWeight: 'bold' }}>{vol.contactInfo}</TableCell>
                                    <TableCell sx={{ ...cellStyle, ...commonFont, fontSize: '0.8rem', color: '#666' }}>{vol.notes}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 10 }}>
                                    <Typography variant="h6" color="textSecondary" sx={commonFont}>לא נמצאו מתנדבות התואמות את הסינון.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>

            {/* Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth sx={{ direction: 'rtl' }}>
                <DialogTitle sx={{ ...commonFont, fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    הוספת מתנדבת חדשה
                    <IconButton onClick={() => setOpenModal(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <AddVolunteer onClose={() => setOpenModal(false)} onRefresh={fetchData} />
                </DialogContent>
            </Dialog>

            <style>{`
                .main-container-font, .main-container-font * { font-family: "Assistant", "Segoe UI", Arial, sans-serif !important; }
                .tech-badge { 
                    background-color: var(--bg-light); 
                    padding: 2px 8px; 
                    border-radius: 10px; 
                    font-size: 0.75rem; 
                    border: 1px solid var(--border-light); 
                    color: var(--primary-dark); 
                    word-break: break-word;
                    display: inline-block;
                }
            `}</style>
        </Box>
    );
};

const headerStyle = { fontWeight: '700', fontSize: '0.85rem', textAlign: 'right', padding: '12px 8px', borderBottom: 'none' };

const cellStyle = {
    textAlign: 'right',
    padding: '16px 8px',
    fontSize: '0.85rem',
    borderBottom: '1px solid var(--border-light)',
    verticalAlign: 'top',
    wordBreak: 'break-word',
    overflowWrap: 'break-word'
};

export default VolunteersTable;