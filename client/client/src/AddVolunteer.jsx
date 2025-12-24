// import React, { useState } from 'react';
// import axios from 'axios';

// const AddVolunteer = ({ onVolunteerAdded }) => {
//     const [formData, setFormData] = useState({
//         fullName: '',
//         helpArea: '',
//         seniority: '',
//         experienceArea: '',
//         technologies: '',
//         workPlace: '',
//         contactInfo: '',
//         notes: ''
//     });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             // הפיכת מחרוזת הטכנולוגיות למערך (Array)
//             const dataToSend = {
//                 ...formData,
//                 technologies: formData.technologies.split(',').map(tech => tech.trim())
//             };

//             await axios.post('http://localhost:5000/api/volunteers', dataToSend);
//             alert('המתנדב נוסף בהצלחה!');
            
//             // איפוס הטופס
//             setFormData({
//                 fullName: '', helpArea: '', seniority: '', 
//                 experienceArea: '', technologies: '', 
//                 workPlace: '', contactInfo: '', notes: ''
//             });

//             // רענון הטבלה
//             onVolunteerAdded();
//         } catch (error) {
//             console.error("שגיאה בהוספת מתנדב:", error);
//         }
//     };

//     return (
//         <div style={{ direction: 'rtl', padding: '20px', backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
//             <h3>רישום מתנדב חדש</h3>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" placeholder="שם מלא" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required /><br/>
//                 <input type="text" placeholder="תחום עזרה (למשל: עריכת קו''ח)" value={formData.helpArea} onChange={(e) => setFormData({...formData, helpArea: e.target.value})} required /><br/>
//                 <input type="number" placeholder="וותק (שנים)" value={formData.seniority} onChange={(e) => setFormData({...formData, seniority: e.target.value})} required /><br/>
//                 <input type="text" placeholder="תחום ניסיון" value={formData.experienceArea} onChange={(e) => setFormData({...formData, experienceArea: e.target.value})} required /><br/>
//                 <input type="text" placeholder="טכנולוגיות (מופרדות בפסיק)" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} /><br/>
//                 <input type="text" placeholder="מקום עבודה" value={formData.workPlace} onChange={(e) => setFormData({...formData, workPlace: e.target.value})} /><br/>
//                 <input type="text" placeholder="פרטי יצירת קשר" value={formData.contactInfo} onChange={(e) => setFormData({...formData, contactInfo: e.target.value})} required /><br/>
//                 <textarea placeholder="הערות" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} /><br/>
//                 <button type="submit">הוסף מתנדב</button>
//             </form>
//         </div>
//     );
// };

// export default AddVolunteer;

import React, { useState } from 'react';
import axios from 'axios';

const AddVolunteer = ({ onVolunteerAdded }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        helpArea: '',
        seniority: '',
        experienceArea: '',
        technologies: '',
        workPlace: '',
        contactInfo: '',
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                technologies: formData.technologies.split(',').map(tech => tech.trim())
            };

            await axios.post('http://localhost:5000/api/volunteers', dataToSend);
            alert('המתנדב נוסף בהצלחה!');
            
            setFormData({
                fullName: '', helpArea: '', seniority: '', 
                experienceArea: '', technologies: '', 
                workPlace: '', contactInfo: '', notes: ''
            });

            onVolunteerAdded();
        } catch (error) {
            console.error("שגיאה בהוספת מתנדב:", error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h3>רישום מתנדב חדש</h3>
                <input type="text" placeholder="שם מלא" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                <input type="text" placeholder="תחום עזרה (למשל: עריכת קו''ח)" value={formData.helpArea} onChange={(e) => setFormData({...formData, helpArea: e.target.value})} required />
                <input type="number" placeholder="וותק (שנים)" value={formData.seniority} onChange={(e) => setFormData({...formData, seniority: e.target.value})} required />
                <input type="text" placeholder="תחום ניסיון" value={formData.experienceArea} onChange={(e) => setFormData({...formData, experienceArea: e.target.value})} required />
                <input type="text" placeholder="טכנולוגיות (מופרדות בפסיק)" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} />
                <input type="text" placeholder="מקום עבודה" value={formData.workPlace} onChange={(e) => setFormData({...formData, workPlace: e.target.value})} />
                <input type="text" placeholder="פרטי יצירת קשר" value={formData.contactInfo} onChange={(e) => setFormData({...formData, contactInfo: e.target.value})} required />
                <textarea placeholder="הערות" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                <button type="submit">הוסף מתנדב</button>
            </form>
        </div>
    );
};

export default AddVolunteer;