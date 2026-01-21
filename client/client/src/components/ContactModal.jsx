import React, { useState, useEffect } from 'react';
import { Send, X, MessageCircle, User, Info } from 'lucide-react'; // הוספתי את MessageCircle

const ContactModal = ({ isOpen, onClose, volunteer, user }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log("[MODAL] נפתח עבור:", volunteer?.fullName || volunteer?.name);
    }
  }, [isOpen, volunteer]);

  if (!isOpen || !volunteer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      alert("שגיאה: לא זוהה משתמש מחובר.");
      return;
    }

    setLoading(true);
    const payload = {
      senderId: user.email,
      senderName: user.name,
      receiverId: volunteer._id,
      receiverName: volunteer.fullName || volunteer.name,
      content: message
    };

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('ההודעה נשלחה בהצלחה!');
        setMessage('');
        onClose();
      } else {
        throw new Error('שגיאה בשליחה');
      }
    } catch (err) {
      alert("השליחה נכשלה.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
      
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={24} />
        </button>

     
        <div style={styles.iconContainer}>
          <div style={styles.iconCircle}>
            <MessageCircle size={40} color="white" fill="white" />
          </div>
        </div>

        <div style={styles.header}>
          <h2 style={styles.title}>פנייה ל{volunteer.fullName || volunteer.name}</h2>
          
          <div style={styles.userInfoBadge}>
            <User size={16} />
            <span>שולחת כ: <strong>{user?.name}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <textarea
              style={styles.textarea}
              required
              rows="8"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="כתבי כאן את הודעתך למתנדבת..."
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            <span style={{ marginLeft: '10px' }}>
              {loading ? 'שולח...' : 'שלחי הודעה'}
            </span>
            <Send size={20} />
          </button>
        </form>
        
        <div style={styles.footerLink}>
          GiveTech Support
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { 
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    zIndex: 5000,
    backdropFilter: 'blur(4px)' 
  },
  card: { 
    backgroundColor: 'white', 
    padding: '40px 30px', 
    borderRadius: '24px', 
    width: '95%', 
    maxWidth: '480px', 
    position: 'relative', 
    direction: 'rtl', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  closeBtn: { 
    position: 'absolute', top: '20px', left: '20px', 
    border: 'none', background: 'none', cursor: 'pointer', color: '#bdc3c7',
    transition: 'color 0.2s'
  },
  iconContainer: {
    marginBottom: '20px',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    backgroundColor: '#3498db', 
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 15px rgba(52, 152, 219, 0.3)'
  },
  header: { textAlign: 'center', marginBottom: '25px', width: '100%' },
  title: { 
    fontSize: '1.6rem', 
    color: '#2c3e50', 
    margin: '0 0 12px 0',
    fontWeight: '700'
  },
  userInfoBadge: { 
    display: 'inline-flex', alignItems: 'center', gap: '8px', 
    padding: '6px 16px', backgroundColor: '#f8f9fa', 
    borderRadius: '20px', color: '#7f8c8d', fontSize: '0.9rem',
    border: '1px solid #eee'
  },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { width: '100%' },
  textarea: { 
    width: '100%',
    padding: '15px', 
    borderRadius: '16px', 
    border: '1px solid #e0e0e0', 
    outline: 'none', 
    resize: 'none', 
    fontSize: '1rem', 
    fontFamily: 'inherit',
    backgroundColor: '#fdfdfd',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    '&:focus': { borderColor: '#3498db' }
  },
  submitBtn: { 
    width: '100%',
    padding: '14px', 
    borderRadius: '30px', 
    border: 'none', 
    backgroundColor: '#2e7d32', 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: '1.1rem',
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    transition: 'transform 0.1s, background-color 0.2s',
    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
  },
  footerLink: {
    marginTop: '20px',
    fontSize: '0.75rem',
    color: '#bdc3c7',
    letterSpacing: '0.5px'
  }
};

export default ContactModal;