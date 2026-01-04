import React, { useState } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';

const ContactModal = ({ isOpen, onClose, volunteer }) => {
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const messageData = {
      senderId: senderName, // כרגע משתמשים בשם שהיא הזינה
      receiverId: volunteer._id,
      content: message,
    };

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        alert('ההודעה נשלחה בהצלחה!');
        onClose();
        setMessage('');
        setSenderName('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('תקלה בשליחת ההודעה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-header">
          <div className="icon-circle">
            <MessageSquare className="blue-icon" />
          </div>
          <h2>שליחת פנייה ל{volunteer.name}</h2>
          <p>ההודעה תועבר ישירות למתנדבת</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>השם שלך</label>
            <input 
              type="text" 
              required 
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="איך קוראים לך?"
            />
          </div>

          <div className="input-group">
            <label>תוכן ההודעה</label>
            <textarea 
              required 
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="כתבי כאן פרטים על הבקשה שלך..."
            ></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'שולח...' : 'שלחי הודעה'}
            <Send size={18} style={{ marginRight: '8px' }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;