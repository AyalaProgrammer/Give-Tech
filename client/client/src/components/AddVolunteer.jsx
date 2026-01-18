import { useState } from 'react';
import axios from 'axios';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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

    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setStatus('');
        setStatusType('');

        try {
            const dataToSend = {
                ...formData,
                technologies: formData.technologies.split(',').map(tech => tech.trim())
            };

            await axios.post('http://localhost:5000/api/volunteers', dataToSend);

            setStatus('המתנדבת נוספה בהצלחה!');
            setStatusType('success');

            setFormData({
                fullName: '', helpArea: '', seniority: '',
                experienceArea: '', technologies: '',
                workPlace: '', contactInfo: '', notes: ''
            });

            setTimeout(() => {
                onVolunteerAdded();
            }, 1500);

        } catch (error) {
            console.error("שגיאה בהוספת מתנדבת:", error);
            setStatus('שגיאה בתקשורת עם השרת');
            setStatusType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid var(--border-light)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <PersonAddIcon style={{ color: 'var(--primary-dark)' }} />
                    <h3 style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '22px' }}>הוספת מתנדבת חדשה</h3>
                </div>

                <input type="text" name="fullName" placeholder="שם מלא" value={formData.fullName} onChange={handleChange} required />
                <input type="text" name="helpArea" placeholder="תחום עזרה (למשל: עריכת קו''ח)" value={formData.helpArea} onChange={handleChange} required />
                <input type="number" name="seniority" placeholder="וותק (שנים)" value={formData.seniority} onChange={handleChange} required />
                <input type="text" name="experienceArea" placeholder="תחום ניסיון" value={formData.experienceArea} onChange={handleChange} required />
                <input type="text" name="technologies" placeholder="טכנולוגיות (מופרדות בפסיק)" value={formData.technologies} onChange={handleChange} />
                <input type="text" name="workPlace" placeholder="מקום עבודה" value={formData.workPlace} onChange={handleChange} />
                <input type="text" name="contactInfo" placeholder="פרטי יצירת קשר (טלפון/אימייל)" value={formData.contactInfo} onChange={handleChange} required />

                <textarea
                    name="notes"
                    placeholder="הערות נוספות..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                />

                {status && (
                    <div className={`status-message ${statusType}`} style={{
                        gridColumn: 'span 2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: statusType === 'success' ? '#e8f5e9' : '#ffebee',
                        color: statusType === 'success' ? '#2e7d32' : '#c62828'
                    }}>
                        {statusType === 'success' ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
                        <span>{status}</span>
                    </div>
                )}

                <div style={{ gridColumn: 'span 2' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        className="nav-btn active"
                        style={{
                            width: '100%',
                            padding: '12px 30px',
                            fontSize: '16px',
                            backgroundColor: loading ? 'var(--bg-button-active)' : 'var(--primary-dark)',
                            color: '#fff',
                            gap: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'שומר נתונים...' : 'הוספת מתנדבת למערכת'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVolunteer;