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

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VolunteersTable = () => {
    const [volunteers, setVolunteers] = useState([]);

    const fetchVolunteers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/volunteers');
            setVolunteers(response.data);
        } catch (error) {
            console.error("שגיאה במשיכת נתונים:", error);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    return (
        <div className="table-container">
            <h2>לוח מתנדבים - GiveTech</h2>
            <table>
                <thead>
                    <tr>
                        <th>שם</th>
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
                    {volunteers.map((vol) => (
                        <tr key={vol._id}>
                            <td>{vol.fullName}</td>
                            <td>{vol.helpArea}</td>
                            <td>{vol.seniority}</td>
                            <td>{vol.experienceArea}</td>
                            <td>{vol.technologies.join(', ')}</td>
                            <td>{vol.workPlace}</td>
                            <td>{vol.contactInfo}</td>
                            <td>{vol.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VolunteersTable;