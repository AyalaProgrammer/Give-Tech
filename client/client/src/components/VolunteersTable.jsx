import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box, Table, TableBody, TableCell, TableRow, Typography,
    Autocomplete, TextField, Button, Badge
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import ContactModal from './ContactModal';

const HELP_AREAS_LIST = ["עזרה והכוונה כללית למתחילות", "ייעוץ - משא ומתן חוזה / דיוני שכר", "ייעוץ - תכנון קריירה", "חיפוש עבודה - ג'וניוריות", "חיפוש עבודה - מנוסות", "ייעוץ - עבודה כפרילנסר בתכנות", "ייעוץ - יחסים בין אישיים בעבודה", "הכנה לראיונות פיתוח פרונטאנד", "עריכת קו''ח"];

const categoryMapping = {
    "עזרה והכוונה כללית למתחילות": ["מתחילות", "הכוונה"],
    "ייעוץ - משא ומתן חוזה / דיוני שכר": ["שכר", "חוזה"],
    "ייעוץ - תכנון קריירה": ["תכנון", "קריירה"],
    "חיפוש עבודה - ג'וניוריות": ["ג'וניור"],
    "חיפוש עבודה - מנוסות": ["סניור", "מנוסות"],
    "עריכת קו''ח": ["קו''ח", "CV"],
    "ייעוץ - עבודה כפרילנסר בתכנות": ["פרילנס"],
    "ייעוץ - יחסים בין אישיים בעבודה": ["יחסים"],
    "הכנה לראיונות פיתוח פרונטאנד": ["ראיון", "פרונט"]
};

const VolunteersTable = ({ user, volunteerId, unreadCount }) => {
    const navigate = useNavigate();
    const [volunteers, setVolunteers] = useState([]);
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [selectedWorkplaces, setSelectedWorkplaces] = useState([]);
    const [selectedHelpAreas, setSelectedHelpAreas] = useState([]);
    const [selectedVol, setSelectedVol] = useState(null);

    const fetchVolunteers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/volunteers');
            setVolunteers(response.data || []);
        } catch (error) {
            console.error("שגיאה במשיכת נתונים:", error);
        }
    }, []);

    useEffect(() => { fetchVolunteers(); }, [fetchVolunteers]);

    const handleUpdate = async (id, currentEmail) => {
        const newEmail = prompt("עדכני את כתובת המייל:", currentEmail);
        if (newEmail && newEmail !== currentEmail) {
            try {
                await axios.put(`http://localhost:5000/api/volunteers/${id}`, { email: newEmail });
                fetchVolunteers();
            } catch (err) { alert("שגיאה בעדכון"); }
        }
    };

    const allTechnologies = useMemo(() => [...new Set(volunteers.flatMap(v => v.technologies || []))].sort(), [volunteers]);
    const allWorkplaces = useMemo(() => [...new Set(volunteers.map(v => v.workPlace))].filter(Boolean).sort(), [volunteers]);

    const filteredVolunteers = useMemo(() => {
        return volunteers.filter(vol => {
            const matchesTech = selectedTechs.length === 0 || (vol.technologies && vol.technologies.some(t => selectedTechs.includes(t)));
            const matchesWorkplace = selectedWorkplaces.length === 0 || selectedWorkplaces.includes(vol.workPlace);
            const matchesHelpArea = selectedHelpAreas.length === 0 || selectedHelpAreas.some(selectedTitle => {
                const keywords = categoryMapping[selectedTitle] || [selectedTitle];
                return keywords.some(keyword => vol.helpArea?.toLowerCase().includes(keyword.toLowerCase()));
            });
            return matchesTech && matchesWorkplace && matchesHelpArea;
        });
    }, [volunteers, selectedTechs, selectedWorkplaces, selectedHelpAreas]);

    return (
        <Box sx={{ width: '100%', direction: 'rtl', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#f4f7f9' }}>
            
            {/* Header נעוץ */}
            <Box sx={{ zIndex: 1200, backgroundColor: '#007bb5', color: 'white', flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <Box sx={{ px: 4, pt: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>רשימת מתנדבות</Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                
                        {volunteerId && (
                            <Box 
                                onClick={() => navigate('/inbox')}
                                sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 }, transition: '0.2s' }}
                            >
                                <Badge 
                                    badgeContent={unreadCount} 
                                    color="error" 
                                    overlap="rectangular"
                                    invisible={!unreadCount || unreadCount === 0}
                                >
                                    <Mail size={28} color="white" />
                                </Badge>
                                <Typography sx={{ fontSize: '0.75rem', color: 'white', mt: 0.5 }}>דואר נכנס</Typography>
                            </Box>
                        )}
                        <Typography sx={{ borderRight: '1px solid rgba(255,255,255,0.3)', pr: 2 }}>
                            שלום, {user?.name || "אורחת"}
                        </Typography>
                    </Box>
                </Box>

         
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {[ 
                        { label: "מקום עבודה", options: allWorkplaces, value: selectedWorkplaces, setter: setSelectedWorkplaces },
                        { label: "שפות וטכנולוגיות", options: allTechnologies, value: selectedTechs, setter: setSelectedTechs },
                        { label: "תחום עזרה", options: HELP_AREAS_LIST, value: selectedHelpAreas, setter: setSelectedHelpAreas }
                    ].map((filter, index) => (
                        <Autocomplete key={index} multiple options={filter.options} value={filter.value} onChange={(e, val) => filter.setter(val)} renderTags={() => null} sx={{ width: 220, backgroundColor: 'white', borderRadius: 1 }} renderInput={(params) => <TextField {...params} placeholder={filter.label} size="small" />} />
                    ))}
                </Box>

              
                <Box sx={{ backgroundColor: '#005f8d', display: 'flex', width: '100%', mt: 1 }}>
                    <Box sx={{ ...headerStyle, width: '20%' }}>שם</Box>
                    <Box sx={{ ...headerStyle, width: '30%' }}>תחום עזרה</Box>
                    <Box sx={{ ...headerStyle, width: '20%' }}>מקום עבודה</Box>
                    <Box sx={{ ...headerStyle, width: '15%' }}>מייל</Box>
                    <Box sx={{ ...headerStyle, width: '15%' }}>פעולות</Box>
                </Box>
            </Box>

     
            <Box sx={{ flex: 1, overflowY: 'auto', backgroundColor: 'white' }}>
                <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableBody>
                        {filteredVolunteers.map((vol) => (
                            <TableRow key={vol._id} hover>
                                <TableCell sx={{ ...cellStyle, width: '20%' }}>{vol.fullName || vol.name}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '30%' }}>{vol.helpArea}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '20%' }}>{vol.workPlace}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '15%' }}>{vol.email}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '15%' }}>
                                    <Button size="small" variant="contained" sx={{ ml: 1 }} onClick={() => setSelectedVol(vol)}>קשר</Button>
                                    {volunteerId && (
                                        <Button size="small" color="inherit" onClick={() => handleUpdate(vol._id, vol.email)}>
                                            <EditIcon fontSize="small" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            <ContactModal isOpen={!!selectedVol} onClose={() => setSelectedVol(null)} volunteer={selectedVol} user={user} />
        </Box>
    );
};

const headerStyle = { color: 'white', fontWeight: 'bold', padding: '12px', fontSize: '0.9rem', textAlign: 'right' };
const cellStyle = { padding: '12px', borderBottom: '1px solid #eee', fontSize: '0.85rem', textAlign: 'right' };

export default VolunteersTable;