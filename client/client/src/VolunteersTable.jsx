// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const VolunteersTable = () => {
//     const [volunteers, setVolunteers] = useState([]);

//     // פונקציה למשיכת הנתונים מהשרת
//     const fetchVolunteers = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/volunteers');
//             setVolunteers(response.data);
//         } catch (error) {
//             console.error("שגיאה במשיכת נתונים:", error);
//         }
//     };

//     useEffect(() => {
//         fetchVolunteers();
//     }, []);

//     return (
//         <div style={{ padding: '20px', direction: 'rtl' }}>
//             <h2>לוח מתנדבים - GiveTech</h2>
//             <table border="1" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
//                 <thead style={{ backgroundColor: '#f2f2f2' }}>
//                     <tr>
//                         <th>שם</th>
//                         <th>תחום עזרה</th>
//                         <th>וותק</th>
//                         <th>תחום ניסיון</th>
//                         <th>טכנולוגיות</th>
//                         <th>מקום עבודה</th>
//                         <th>פרטי קשר</th>
//                         <th>הערות</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {volunteers.map((vol) => (
//                         <tr key={vol._id}>
//                             <td>{vol.fullName}</td>
//                             <td>{vol.helpArea}</td>
//                             <td>{vol.seniority}</td>
//                             <td>{vol.experienceArea}</td>
//                             <td>{vol.technologies.join(', ')}</td>
//                             <td>{vol.workPlace}</td>
//                             <td>{vol.contactInfo}</td>
//                             <td>{vol.notes}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default VolunteersTable;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const VolunteersTable = () => {
//     const [volunteers, setVolunteers] = useState([]);

//     const fetchVolunteers = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/volunteers');
//             setVolunteers(response.data);
//         } catch (error) {
//             console.error("שגיאה במשיכת נתונים:", error);
//         }
//     };

//     useEffect(() => {
//         fetchVolunteers();
//     }, []);

//     return (
//         <div className="table-container">
//             <h2>לוח מתנדבים - GiveTech</h2>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>שם</th>
//                         <th>תחום עזרה</th>
//                         <th>וותק</th>
//                         <th>תחום ניסיון</th>
//                         <th>טכנולוגיות</th>
//                         <th>מקום עבודה</th>
//                         <th>פרטי קשר</th>
//                         <th>הערות</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {volunteers.map((vol) => (
//                         <tr key={vol._id}>
//                             <td>{vol.fullName}</td>
//                             <td>{vol.helpArea}</td>
//                             <td>{vol.seniority}</td>
//                             <td>{vol.experienceArea}</td>
//                             <td>{vol.technologies.join(', ')}</td>
//                             <td>{vol.workPlace}</td>
//                             <td>{vol.contactInfo}</td>
//                             <td>{vol.notes}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default VolunteersTable;



/*רות*/


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // --- נתוני דמה (Mock Data) לצורך פיתוח ---
// const mockVolunteers = [
//     {
//         _id: '1',
//         fullName: 'ישראל ישראלי',
//         helpArea: 'כתיבת קורות חיים',
//         seniority: '5 שנים',
//         experienceArea: 'Fullstack',
//         technologies: ['React', 'Node.js'],
//         workPlace: 'Google',
//         contactInfo: 'israel@test.com',
//         notes: 'זמין בערבים',
//         language: 'עברית'
//     },
//     {
//         _id: '2',
//         fullName: 'מיכל לוי',
//         helpArea: 'הכנה לראיון טכני',
//         seniority: '8 שנים',
//         experienceArea: 'Backend',
//         technologies: ['Java', 'Spring'],
//         workPlace: 'Microsoft',
//         contactInfo: 'michal@test.com',
//         notes: 'מעדיפה זום',
//         language: 'אנגלית'
//     },
//     {
//         _id: '3',
//         fullName: 'דוד כהן',
//         helpArea: 'כתיבת קורות חיים',
//         seniority: '3 שנים',
//         experienceArea: 'Frontend',
//         technologies: ['Vue', 'CSS'],
//         workPlace: 'Google',
//         contactInfo: 'david@test.com',
//         notes: 'בשמחה',
//         language: 'עברית'
//     }
// ];

// const VolunteersTable = () => {
//     // שלב 1: שימוש בנתוני הדמה ב-State ההתחלתי
//     const [volunteers, setVolunteers] = useState(mockVolunteers); 
    
//     // שלב 2: משתני מצב למסננים
//     const [filterLanguage, setFilterLanguage] = useState("");
//     const [filterWorkPlace, setFilterWorkPlace] = useState("");
//     const [filterHelpArea, setFilterHelpArea] = useState("");

//     const fetchVolunteers = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/volunteers');
//             if (response.data.length > 0) {
//                 setVolunteers(response.data);
//             }
//         } catch (error) {
//             console.error("שגיאה במשיכת נתונים (עובד עם נתוני דמה):", error);
//         }
//     };

//     useEffect(() => {
//         // כרגע הקריאה לשרת תנסה לעבוד, אם תיכשל - נישאר עם נתוני הדמה
//         fetchVolunteers();
//     }, []);

//     // שלב 3: לוגיקת הסינון
//     const filteredVolunteers = volunteers.filter(vol => {
//         return (
//             (filterLanguage === "" || vol.language === filterLanguage) &&
//             (filterWorkPlace === "" || vol.workPlace === filterWorkPlace) &&
//             (filterHelpArea === "" || vol.helpArea === filterHelpArea)
//         );
//     });

//     return (
//         <div className="table-container">
//             <h2>לוח מתנדבים - GiveTech</h2>

//             {/* --- אזור המסננים --- */}
//             <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', background: '#f4f4f4', padding: '10px', borderRadius: '8px' }}>
//                 <div>
//                     <label>שפה: </label>
//                     <select onChange={(e) => setFilterLanguage(e.target.value)}>
//                         <option value="">הכל</option>
//                         <option value="עברית">עברית</option>
//                         <option value="אנגלית">אנגלית</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label>מקום עבודה: </label>
//                     <select onChange={(e) => setFilterWorkPlace(e.target.value)}>
//                         <option value="">הכל</option>
//                         <option value="Google">Google</option>
//                         <option value="Microsoft">Microsoft</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label>תחום עזרה: </label>
//                     <select onChange={(e) => setFilterHelpArea(e.target.value)}>
//                         <option value="">הכל</option>
//                         <option value="כתיבת קורות חיים">כתיבת קורות חיים</option>
//                         <option value="הכנה לראיון טכני">הכנה לראיון טכני</option>
//                     </select>
//                 </div>
//             </div>

//             {/* --- הטבלה (מציגה את הרשימה המסוננת) --- */}
//             <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead>
//                     <tr>
//                         <th>שם</th>
//                         <th>שפה</th>
//                         <th>תחום עזרה</th>
//                         <th>וותק</th>
//                         <th>תחום ניסיון</th>
//                         <th>טכנולוגיות</th>
//                         <th>מקום עבודה</th>
//                         <th>פרטי קשר</th>
//                         <th>הערות</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredVolunteers.map((vol) => (
//                         <tr key={vol._id}>
//                             <td>{vol.fullName}</td>
//                             <td>{vol.language || 'לא צוין'}</td>
//                             <td>{vol.helpArea}</td>
//                             <td>{vol.seniority}</td>
//                             <td>{vol.experienceArea}</td>
//                             <td>{Array.isArray(vol.technologies) ? vol.technologies.join(', ') : vol.technologies}</td>
//                             <td>{vol.workPlace}</td>
//                             <td>{vol.contactInfo}</td>
//                             <td>{vol.notes}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {filteredVolunteers.length === 0 && <p>לא נמצאו מתנדבים התואמים את הסינון.</p>}
//         </div>
//     );
// };

// export default VolunteersTable;





import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VolunteersTable = () => {
    const [volunteers, setVolunteers] = useState([]);
    
    // מצב למסננים
    const [selectedTech, setSelectedTech] = useState("");
    const [selectedWorkplace, setSelectedWorkplace] = useState("");
    const [selectedHelpArea, setSelectedHelpArea] = useState("");

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/volunteers');
                setVolunteers(response.data || []);
            } catch (error) {
                console.error("שגיאה במשיכת נתונים:", error);
            }
        };
        fetchVolunteers();
    }, []);

    // יצירת רשימות ייחודיות לדרופדאונים (מבוסס על הנתונים שחזרו מהשרת)
    const allTechnologies = [...new Set((volunteers || []).flatMap(v => v.technologies || []))].sort();
    const allWorkplaces = [...new Set((volunteers || []).map(v => v.workPlace))].filter(Boolean).sort();
    const allHelpAreas = [...new Set((volunteers || []).map(v => v.helpArea))].filter(Boolean).sort();

    // לוגיקת הסינון המשולבת
    const filteredVolunteers = volunteers.filter(vol => {
        return (
            (selectedTech === "" || (vol.technologies && vol.technologies.includes(selectedTech))) &&
            (selectedWorkplace === "" || vol.workPlace === selectedWorkplace) &&
            (selectedHelpArea === "" || vol.helpArea === selectedHelpArea)
        );
    });

    return (
        <div className="table-container" style={{ padding: '20px', direction: 'rtl' }}>
            <h2>לוח מתנדבים - GiveTech</h2>

            {/* אזור המסננים */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                <div>
                    <label>טכנולוגיה: </label>
                    <select onChange={(e) => setSelectedTech(e.target.value)} style={{ padding: '5px' }}>
                        <option value="">כל הטכנולוגיות</option>
                        {allTechnologies.map(tech => <option key={tech} value={tech}>{tech}</option>)}
                    </select>
                </div>

                <div>
                    <label>מקום עבודה: </label>
                    <select onChange={(e) => setSelectedWorkplace(e.target.value)} style={{ padding: '5px' }}>
                        <option value="">כל מקומות העבודה</option>
                        {allWorkplaces.map(work => <option key={work} value={work}>{work}</option>)}
                    </select>
                </div>

                <div>
                    <label>תחום עזרה: </label>
                    <select onChange={(e) => setSelectedHelpArea(e.target.value)} style={{ padding: '5px' }}>
                        <option value="">כל תחומי העזרה</option>
                        {allHelpAreas.map(area => <option key={area} value={area}>{area}</option>)}
                    </select>
                </div>
            </div>

            {/* הטבלה המורחבת עם כל העמודות */}
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead>
                    <tr style={{ backgroundColor: '#eef2f7' }}>
                        <th style={{ padding: '10px' }}>שם מלא</th>
                        <th>תחום עזרה</th>
                        <th>וותק</th>
                        <th>תחום ניסיון</th>
                        <th>טכנולוגיות</th>
                        <th>מקום עבודה</th>
                        <th>פרטי קשר</th>
                        <th>הערות</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVolunteers.length > 0 ? (
                        filteredVolunteers.map((vol) => (
                            <tr key={vol._id || Math.random()} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{vol.fullName}</td>
                                <td>{vol.helpArea}</td>
                                <td>{vol.seniority}</td>
                                <td>{vol.experienceArea}</td>
                                <td>{Array.isArray(vol.technologies) ? vol.technologies.join(', ') : ''}</td>
                                <td>{vol.workPlace}</td>
                                <td>{vol.contactInfo}</td>
                                <td>{vol.notes}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>לא נמצאו מתנדבים התואמים את הסינון</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VolunteersTable;