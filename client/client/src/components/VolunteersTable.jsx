// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Box, Table, TableBody, TableCell, TableContainer, TableHead, 
//   TableRow, Paper, Typography, Checkbox, Autocomplete, TextField 
// } from '@mui/material';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import axios from 'axios';
// import ContactModal from './ContactModal';

// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

// // 1. הגדרת הכותרות שמופיעות למשתמש בסינון
// const HELP_AREAS_LIST = [
//     "עזרה והכוונה כללית למתחילות",
//     "ייעוץ - משא ומתן חוזה / דיוני שכר",
//     "ייעוץ - תכנון קריירה",
//     "חיפוש עבודה - ג'וניוריות",
//     "חיפוש עבודה - מנוסות",
//     "ייעוץ - עבודה כפרילנסר בתכנות",
//     "ייעוץ - יחסים בין אישיים בעבודה",
//     "הכנה לראיונות פיתוח פרונטאנד",
//     "עריכת קו''ח"
// ];

// const categoryMapping = {
//     "עזרה והכוונה כללית למתחילות": [
//         "מתחילות", "הכוונה", "צעד ראשון", "ייעוץ ראשוני", "צעדים ראשונים", 
//         "ללא ניסיון", "מתחילה", "כניסה להייטק", "כניסה לתחום"
//     ],
//     "ייעוץ - משא ומתן חוזה / דיוני שכר": [
//         "שכר", "חוזה", "משא ומתן", "דיון שכר", "תנאים", "הצעת עבודה", "חתימה"
//     ],
//     "ייעוץ - תכנון קריירה": [
//         "תכנון", "קריירה", "מסלול", "קידום", "אופק", "שינוי כיוון", "ייעוץ קריירה"
//     ],
//     "חיפוש עבודה - ג'וניוריות": [
//         "ג'וניור", "ג'וניוריות", "מחפשת עבודה", "עבודה ראשונה", "מתחילות", 
//         "חוסר ניסיון", "גוניור", "junior"
//     ],
//     "חיפוש עבודה - מנוסות": [
//         "מנוסות", "סניור", "בכירה", "מעבר עבודה", "ניהול", "senior"
//     ],
//     "עריכת קו''ח": [
//         "קו''ח", "קורות חיים", "CV", "קו ח", "קורות", "לינקדין", "Linkedin"
//     ],
//     "ייעוץ - עבודה כפרילנסר בתכנות": [
//         "פרילנס", "עצמאית", "עצמאי", "freelance", "עסק", "לקוחות"
//     ],
//     "ייעוץ - יחסים בין אישיים בעבודה": [
//         "יחסים", "בינאישי", "חברתית", "סביבת עבודה", "פוליטיקה", "מנהל", "צוות"
//     ],
//     "הכנה לראיונות פיתוח פרונטאנד": [
//         "ראיון", "פרונט", "React", "Frontend", "JS", "קוד", "משימת בית", "טכני"
//     ]
// };

// const VolunteersTable = () => {
//     const [volunteers, setVolunteers] = useState([]);
//     const [selectedTechs, setSelectedTechs] = useState([]);
//     const [selectedWorkplaces, setSelectedWorkplaces] = useState([]);
//     const [selectedHelpAreas, setSelectedHelpAreas] = useState([]);
//     const [selectedVol, setSelectedVol] = useState(null);
//     useEffect(() => {
//         const fetchVolunteers = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/volunteers');
//                 setVolunteers(response.data || []);
//             } catch (error) {
//                 console.error("שגיאה במשיכת נתונים:", error);
//             }
//         };
//         fetchVolunteers();
//     }, []);

//     const allTechnologies = useMemo(() => [...new Set(volunteers.flatMap(v => v.technologies || []))].sort(), [volunteers]);
//     const allWorkplaces = useMemo(() => [...new Set(volunteers.map(v => v.workPlace))].filter(Boolean).sort(), [volunteers]);

//     // 3. לוגיקת הסינון החכמה
//     const filteredVolunteers = useMemo(() => {
//         return volunteers.filter(vol => {
//             const matchesTech = selectedTechs.length === 0 || (vol.technologies && vol.technologies.some(t => selectedTechs.includes(t)));
//             const matchesWorkplace = selectedWorkplaces.length === 0 || selectedWorkplaces.includes(vol.workPlace);
            
//             // סינון תחום עזרה באמצעות המיפוי
//             const matchesHelpArea = selectedHelpAreas.length === 0 || selectedHelpAreas.some(selectedTitle => {
//                 const keywords = categoryMapping[selectedTitle] || [selectedTitle];
//                 // בודק אם אחת ממילות המפתח קיימת בתוך הטקסט הארוך שמגיע מהשרת (vol.helpArea)
//                 return keywords.some(keyword => 
//                     vol.helpArea?.toLowerCase().includes(keyword.toLowerCase())
//                 );
//             });

//             return matchesTech && matchesWorkplace && matchesHelpArea;
//         });
//     }, [volunteers, selectedTechs, selectedWorkplaces, selectedHelpAreas]);

//     return (
//         <Box sx={{ width: '100%', direction: 'rtl', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            
//             {/* קונטיינר עליון קבוע */}
//             <Box sx={{ zIndex: 1200, backgroundColor: '#007bb5', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
//                 <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//                     <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>GiveTech</Typography>
//                     <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
//                         {[ 
//                             { label: "מקום עבודה", options: allWorkplaces, value: selectedWorkplaces, setter: setSelectedWorkplaces },
//                             { label: "שפות וטכנולוגיות", options: allTechnologies, value: selectedTechs, setter: setSelectedTechs },
//                             { label: "תחום עזרה", options: HELP_AREAS_LIST, value: selectedHelpAreas, setter: setSelectedHelpAreas }
//                         ].map((filter, index) => (
//                             <Autocomplete
//                                 key={index}
//                                 multiple
//                                 options={filter.options}
//                                 value={filter.value}
//                                 onChange={(e, val) => filter.setter(val)}
//                                 disableCloseOnSelect
//                                 renderTags={() => null}
//                                 sx={{ width: 280, backgroundColor: 'white', borderRadius: 1, "& fieldset": { border: "none" } }}
//                                 renderInput={(params) => (
//                                     <TextField {...params} placeholder={filter.value.length > 0 ? `${filter.label} (${filter.value.length})` : filter.label} />
//                                 )}
//                                 renderOption={(props, option, { selected }) => (
//                                     <li {...props} style={{ direction: 'rtl', justifyContent: 'space-between' }}>
//                                         {option}
//                                         <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} size="small" />
//                                     </li>
//                                 )}
//                             />
//                         ))}
//                     </Box>
//                 </Box>

//                 {/* כותרת הטבלה הכהה */}
//                 <Box sx={{ backgroundColor: '#005f8d', display: 'flex', width: '100%', borderBottom: '2px solid #004a6e' }}>
//                     <Box sx={{ ...headerStyle, width: '10%' }}>שם</Box>
//                     <Box sx={{ ...headerStyle, width: '25%' }}>תחום עזרה</Box>
//                     <Box sx={{ ...headerStyle, width: '8%' }}>וותק</Box>
//                     <Box sx={{ ...headerStyle, width: '15%' }}>תחום ניסיון</Box>
//                     <Box sx={{ ...headerStyle, width: '12%' }}>טכנולוגיות</Box>
//                     <Box sx={{ ...headerStyle, width: '10%' }}>מקום עבודה</Box>
//                     <Box sx={{ ...headerStyle, width: '10%' }}>פרטי קשר</Box>
//                     <Box sx={{ ...headerStyle, width: '10%' }}>הערות</Box>
//                 </Box>
//             </Box>

//             {/* גוף הטבלה עם גלילה */}
//             <Box sx={{ flex: 1, overflowY: 'auto', width: '100%' }}>
//                 <Table sx={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
//                     <TableBody>
//                         {filteredVolunteers.map((vol) => (
//                             <TableRow key={vol._id} sx={{ '&:hover': { backgroundColor: '#f5faff' } }}>
//                                 <TableCell sx={{ ...cellStyle, width: '10%' }}>{vol.fullName}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '25%', whiteSpace: 'normal' }}>{vol.helpArea}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '8%' }}>{vol.seniority}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '15%' }}>{vol.experienceArea}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '12%' }}>{vol.technologies?.join(', ')}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '10%' }}>{vol.workPlace}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '10%', color: '#007bb5', fontWeight: 'bold' }}>{vol.contactInfo}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '10%' }}>{vol.notes}</TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </Box>
//         </Box>
//     );
// };

// const headerStyle = {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: '0.95rem',
//     textAlign: 'right',
//     padding: '16px',
//     boxSizing: 'border-box'
// };

// const cellStyle = {
//     textAlign: 'right',
//     padding: '14px 16px',
//     fontSize: '0.9rem',
//     borderBottom: '1px solid #eee',
//     verticalAlign: 'top',
//     wordBreak: 'break-word',
//     boxSizing: 'border-box'
// };

// export default VolunteersTable;



// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Box, Table, TableBody, TableCell, TableContainer, TableHead, 
//   TableRow, Paper, Typography, Checkbox, Autocomplete, TextField 
// } from '@mui/material';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import axios from 'axios';
// // ייבוא הקומפוננטה החדשה
// import ContactModal from './ContactModal';

// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

// const HELP_AREAS_LIST = [
//     "עזרה והכוונה כללית למתחילות",
//     "ייעוץ - משא ומתן חוזה / דיוני שכר",
//     "ייעוץ - תכנון קריירה",
//     "חיפוש עבודה - ג'וניוריות",
//     "חיפוש עבודה - מנוסות",
//     "ייעוץ - עבודה כפרילנסר בתכנות",
//     "ייעוץ - יחסים בין אישיים בעבודה",
//     "הכנה לראיונות פיתוח פרונטאנד",
//     "עריכת קו''ח"
// ];

// const categoryMapping = {
//     "עזרה והכוונה כללית למתחילות": ["מתחילות", "הכוונה", "צעד ראשון", "ייעוץ ראשוני", "צעדים ראשונים", "ללא ניסיון", "מתחילה", "כניסה להייטק", "כניסה לתחום"],
//     "ייעוץ - משא ומתן חוזה / דיוני שכר": ["שכר", "חוזה", "משא ומתן", "דיון שכר", "תנאים", "הצעת עבודה", "חתימה"],
//     "ייעוץ - תכנון קריירה": ["תכנון", "קריירה", "מסלול", "קידום", "אופק", "שינוי כיוון", "ייעוץ קריירה"],
//     "חיפוש עבודה - ג'וניוריות": ["ג'וניור", "ג'וניוריות", "מחפשת עבודה", "עבודה ראשונה", "מתחילות", "חוסר ניסיון", "גוניור", "junior"],
//     "חיפוש עבודה - מנוסות": ["מנוסות", "סניור", "בכירה", "מעבר עבודה", "ניהול", "senior"],
//     "עריכת קו''ח": ["קו''ח", "קורות חיים", "CV", "קו ח", "קורות", "לינקדין", "Linkedin"],
//     "ייעוץ - עבודה כפרילנסר בתכנות": ["פרילנס", "עצמאית", "עצמאי", "freelance", "עסק", "לקוחות"],
//     "ייעוץ - יחסים בין אישיים בעבודה": ["יחסים", "בינאישי", "חברתית", "סביבת עבודה", "פוליטיקה", "מנהל", "צוות"],
//     "הכנה לראיונות פיתוח פרונטאנד": ["ראיון", "פרונט", "React", "Frontend", "JS", "קוד", "משימת בית", "טכני"]
// };

// const VolunteersTable = () => {
//     const [volunteers, setVolunteers] = useState([]);
//     const [selectedTechs, setSelectedTechs] = useState([]);
//     const [selectedWorkplaces, setSelectedWorkplaces] = useState([]);
//     const [selectedHelpAreas, setSelectedHelpAreas] = useState([]);
    
//     // --- 1. הוספת State למתנדבת שנבחרה ---
//     const [selectedVol, setSelectedVol] = useState(null);

//     useEffect(() => {
//         const fetchVolunteers = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/volunteers');
//                 setVolunteers(response.data || []);
//             } catch (error) {
//                 console.error("שגיאה במשיכת נתונים:", error);
//             }
//         };
//         fetchVolunteers();
//     }, []);

//     const allTechnologies = useMemo(() => [...new Set(volunteers.flatMap(v => v.technologies || []))].sort(), [volunteers]);
//     const allWorkplaces = useMemo(() => [...new Set(volunteers.map(v => v.workPlace))].filter(Boolean).sort(), [volunteers]);

//     const filteredVolunteers = useMemo(() => {
//         return volunteers.filter(vol => {
//             const matchesTech = selectedTechs.length === 0 || (vol.technologies && vol.technologies.some(t => selectedTechs.includes(t)));
//             const matchesWorkplace = selectedWorkplaces.length === 0 || selectedWorkplaces.includes(vol.workPlace);
//             const matchesHelpArea = selectedHelpAreas.length === 0 || selectedHelpAreas.some(selectedTitle => {
//                 const keywords = categoryMapping[selectedTitle] || [selectedTitle];
//                 return keywords.some(keyword => vol.helpArea?.toLowerCase().includes(keyword.toLowerCase()));
//             });
//             return matchesTech && matchesWorkplace && matchesHelpArea;
//         });
//     }, [volunteers, selectedTechs, selectedWorkplaces, selectedHelpAreas]);
//     // פונקציית העדכון בתוך VolunteersTable.jsx
// const handleUpdate = async (id, updatedData) => {
//     try {
//         await axios.put(`http://localhost:5000/api/volunteers/${id}`, updatedData);
//         alert("הנתונים עודכנו בהצלחה!");
//         fetchVolunteers(); // רענון הטבלה
//     } catch (err) {
//         alert("שגיאה בעדכון: " + err.message);
//     }
// };

//     return (
//         <Box sx={{ width: '100%', direction: 'rtl', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            
//             {/* קונטיינר עליון קבוע */}
//             <Box sx={{ zIndex: 1200, backgroundColor: '#007bb5', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
//                 <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//                     <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>GiveTech</Typography>
//                     <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
//                         {[ 
//                             { label: "מקום עבודה", options: allWorkplaces, value: selectedWorkplaces, setter: setSelectedWorkplaces },
//                             { label: "שפות וטכנולוגיות", options: allTechnologies, value: selectedTechs, setter: setSelectedTechs },
//                             { label: "תחום עזרה", options: HELP_AREAS_LIST, value: selectedHelpAreas, setter: setSelectedHelpAreas }
//                         ].map((filter, index) => (
//                             <Autocomplete
//                                 key={index}
//                                 multiple
//                                 options={filter.options}
//                                 value={filter.value}
//                                 onChange={(e, val) => filter.setter(val)}
//                                 disableCloseOnSelect
//                                 renderTags={() => null}
//                                 sx={{ width: 280, backgroundColor: 'white', borderRadius: 1, "& fieldset": { border: "none" } }}
//                                 renderInput={(params) => (
//                                     <TextField {...params} placeholder={filter.value.length > 0 ? `${filter.label} (${filter.value.length})` : filter.label} />
//                                 )}
//                                 renderOption={(props, option, { selected }) => (
//                                     <li {...props} style={{ direction: 'rtl', justifyContent: 'space-between' }}>
//                                         {option}
//                                         <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} size="small" />
//                                     </li>
//                                 )}
//                             />
//                         ))}
//                     </Box>
//                 </Box>

//                 {/* כותרת הטבלה הכהה */}
//                 <Box sx={{ backgroundColor: '#005f8d', display: 'flex', width: '100%', borderBottom: '2px solid #004a6e' }}>
//                     <Box sx={{ ...headerStyle, width: '10%' }}>שם</Box>
//                     <Box sx={{ ...headerStyle, width: '25%' }}>תחום עזרה</Box>
//                     <Box sx={{ ...headerStyle, width: '8%' }}>וותק</Box>
//                     <Box sx={{ ...headerStyle, width: '15%' }}>תחום ניסיון</Box>
//                     <Box sx={{ ...headerStyle, width: '12%' }}>טכנולוגיות</Box>
//                     <Box sx={{ ...headerStyle, width: '10%' }}>מקום עבודה</Box>
//                     <Box sx={{ ...headerStyle, width: '10%' }}>פרטי קשר</Box>
//                     <Box sx={{ ...headerStyle, width: '10%' }}>הערות</Box>
//                 </Box>
//             </Box>

//             {/* גוף הטבלה עם גלילה */}
//             <Box sx={{ flex: 1, overflowY: 'auto', width: '100%' }}>
//                 <Table sx={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
//                     <TableBody>
//                         {filteredVolunteers.map((vol) => (
//                             <TableRow key={vol._id} sx={{ '&:hover': { backgroundColor: '#f5faff' } }}>
//                                 <TableCell sx={{ ...cellStyle, width: '10%' }}>{vol.fullName}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '25%', whiteSpace: 'normal' }}>{vol.helpArea}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '8%' }}>{vol.seniority}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '15%' }}>{vol.experienceArea}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '12%' }}>{vol.technologies?.join(', ')}</TableCell>
//                                 <TableCell sx={{ ...cellStyle, width: '10%' }}>{vol.workPlace}</TableCell>
                                
//                                 {/* --- 2. עדכון תא פרטי קשר שיהיה לחיץ --- */}
//                                 <TableCell 
//                                     sx={{ ...cellStyle, width: '10%', color: '#007bb5', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
//                                     onClick={() => setSelectedVol(vol)}
//                                 >
//                                     יצירת קשר דרך הקהילה
//                                 </TableCell>
                                
//                                 <TableCell sx={{ ...cellStyle, width: '10%' }}>{vol.notes}</TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </Box>

//             {/* --- 3. הוספת המודאל בסוף ה-JSX --- */}
//             <ContactModal 
//                 isOpen={!!selectedVol} 
//                 onClose={() => setSelectedVol(null)} 
//                 volunteer={selectedVol} 
//             />

//         </Box>
//     );
// };

// const headerStyle = {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: '0.95rem',
//     textAlign: 'right',
//     padding: '16px',
//     boxSizing: 'border-box'
// };

// const cellStyle = {
//     textAlign: 'right',
//     padding: '14px 16px',
//     fontSize: '0.9rem',
//     borderBottom: '1px solid #eee',
//     verticalAlign: 'top',
//     wordBreak: 'break-word',
//     boxSizing: 'border-box'
// };

// export default VolunteersTable;




import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableRow, Typography, 
  Checkbox, Autocomplete, TextField, Button 
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import ContactModal from './ContactModal';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const HELP_AREAS_LIST = [
    "עזרה והכוונה כללית למתחילות",
    "ייעוץ - משא ומתן חוזה / דיוני שכר",
    "ייעוץ - תכנון קריירה",
    "חיפוש עבודה - ג'וניוריות",
    "חיפוש עבודה - מנוסות",
    "ייעוץ - עבודה כפרילנסר בתכנות",
    "ייעוץ - יחסים בין אישיים בעבודה",
    "הכנה לראיונות פיתוח פרונטאנד",
    "עריכת קו''ח"
];

const categoryMapping = {
    "עזרה והכוונה כללית למתחילות": ["מתחילות", "הכוונה", "צעד ראשון", "ייעוץ ראשוני", "צעדים ראשונים", "ללא ניסיון", "מתחילה", "כניסה להייטק", "כניסה לתחום"],
    "ייעוץ - משא ומתן חוזה / דיוני שכר": ["שכר", "חוזה", "משא ומתן", "דיון שכר", "תנאים", "הצעת עבודה", "חתימה"],
    "ייעוץ - תכנון קריירה": ["תכנון", "קריירה", "מסלול", "קידום", "אופק", "שינוי כיוון", "ייעוץ קריירה"],
    "חיפוש עבודה - ג'וניוריות": ["ג'וניור", "ג'וניוריות", "מחפשת עבודה", "עבודה ראשונה", "מתחילות", "חוסר ניסיון", "גוניור", "junior"],
    "חיפוש עבודה - מנוסות": ["מנוסות", "סניור", "בכירה", "מעבר עבודה", "ניהול", "senior"],
    "עריכת קו''ח": ["קו''ח", "קורות חיים", "CV", "קו ח", "קורות", "לינקדין", "Linkedin"],
    "ייעוץ - עבודה כפרילנסר בתכנות": ["פרילנס", "עצמאית", "עצמאי", "freelance", "עסק", "לקוחות"],
    "ייעוץ - יחסים בין אישיים בעבודה": ["יחסים", "בינאישי", "חברתית", "סביבת עבודה", "פוליטיקה", "מנהל", "צוות"],
    "הכנה לראיונות פיתוח פרונטאנד": ["ראיון", "פרונט", "React", "Frontend", "JS", "קוד", "משימת בית", "טכני"]
};

const VolunteersTable = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [selectedWorkplaces, setSelectedWorkplaces] = useState([]);
    const [selectedHelpAreas, setSelectedHelpAreas] = useState([]);
    const [selectedVol, setSelectedVol] = useState(null);

    // פונקציית משיכת נתונים שהגדרנו כ-useCallback כדי שנוכל לקרוא לה אחרי עדכון
    const fetchVolunteers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/volunteers');
            setVolunteers(response.data || []);
        } catch (error) {
            console.error("שגיאה במשיכת נתונים:", error);
        }
    }, []);

    useEffect(() => {
        fetchVolunteers();
    }, [fetchVolunteers]);

    // פונקציית העדכון - עכשיו היא מחוברת לכפתור בטבלה
    const handleUpdate = async (id, currentEmail) => {
        const newEmail = prompt("עדכני את כתובת המייל עבור המתנדבת:", currentEmail);
        
        if (newEmail && newEmail !== currentEmail) {
            try {
                await axios.put(`http://localhost:5000/api/volunteers/${id}`, { email: newEmail });
                alert("המייל עודכן בהצלחה!");
                fetchVolunteers(); // רענון הנתונים בטבלה
            } catch (err) {
                alert("שגיאה בעדכון: " + (err.response?.data?.message || err.message));
            }
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
        <Box sx={{ width: '100%', direction: 'rtl', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            <Box sx={{ zIndex: 1200, backgroundColor: '#007bb5', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>GiveTech</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {[ 
                            { label: "מקום עבודה", options: allWorkplaces, value: selectedWorkplaces, setter: setSelectedWorkplaces },
                            { label: "שפות וטכנולוגיות", options: allTechnologies, value: selectedTechs, setter: setSelectedTechs },
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
                                sx={{ width: 280, backgroundColor: 'white', borderRadius: 1, "& fieldset": { border: "none" } }}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder={filter.value.length > 0 ? `${filter.label} (${filter.value.length})` : filter.label} />
                                )}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} style={{ direction: 'rtl', justifyContent: 'space-between' }}>
                                        {option}
                                        <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} size="small" />
                                    </li>
                                )}
                            />
                        ))}
                    </Box>
                </Box>

                {/* כותרת הטבלה - הוספתי עמודת מייל ועמודת עריכה */}
                <Box sx={{ backgroundColor: '#005f8d', display: 'flex', width: '100%', borderBottom: '2px solid #004a6e' }}>
                    <Box sx={{ ...headerStyle, width: '10%' }}>שם</Box>
                    <Box sx={{ ...headerStyle, width: '20%' }}>תחום עזרה</Box>
                    <Box sx={{ ...headerStyle, width: '7%' }}>וותק</Box>
                    <Box sx={{ ...headerStyle, width: '12%' }}>ניסיון</Box>
                    <Box sx={{ ...headerStyle, width: '10%' }}>טכנולוגיות</Box>
                    <Box sx={{ ...headerStyle, width: '10%' }}>מקום עבודה</Box>
                    <Box sx={{ ...headerStyle, width: '13%' }}>מייל</Box>
                    <Box sx={{ ...headerStyle, width: '10%' }}>פרטי קשר</Box>
                    <Box sx={{ ...headerStyle, width: '8%' }}>עריכה</Box>
                </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', width: '100%' }}>
                <Table sx={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                    <TableBody>
                        {filteredVolunteers.map((vol) => (
                            <TableRow key={vol._id} sx={{ '&:hover': { backgroundColor: '#f5faff' } }}>
                                <TableCell sx={{ ...cellStyle, width: '10%' }}>{vol.fullName}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '20%', whiteSpace: 'normal' }}>{vol.helpArea}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '7%' }}>{vol.seniority}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '12%' }}>{vol.experienceArea}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '10%' }}>{vol.technologies?.join(', ')}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '10%' }}>{vol.workPlace}</TableCell>
                                
                                {/* עמודת המייל החדשה - פה תראי אם המייל תקין */}
                                <TableCell sx={{ ...cellStyle, width: '13%', color: '#666', fontSize: '0.8rem' }}>
                                    {vol.email || "חסר מייל"}
                                </TableCell>

                                <TableCell 
                                    sx={{ ...cellStyle, width: '10%', color: '#007bb5', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => setSelectedVol(vol)}
                                >
                                    יצירת קשר
                                </TableCell>
                                
                                {/* כפתור עריכה שקורא לפונקציהhandleUpdate */}
                                <TableCell sx={{ ...cellStyle, width: '8%', textAlign: 'center' }}>
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        color="warning"
                                        onClick={() => handleUpdate(vol._id, vol.email)}
                                        sx={{ minWidth: 'unset', p: 0.5 }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            <ContactModal 
                isOpen={!!selectedVol} 
                onClose={() => setSelectedVol(null)} 
                volunteer={selectedVol} 
            />
        </Box>
    );
};

const headerStyle = {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    textAlign: 'right',
    padding: '12px 16px',
    boxSizing: 'border-box'
};

const cellStyle = {
    textAlign: 'right',
    padding: '10px 16px',
    fontSize: '0.85rem',
    borderBottom: '1px solid #eee',
    verticalAlign: 'middle',
    wordBreak: 'break-word',
    boxSizing: 'border-box'
};

export default VolunteersTable;