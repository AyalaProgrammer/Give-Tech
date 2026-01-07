import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Mail, Clock, User, RefreshCw, X, Send, ArrowRight } from 'lucide-react'; 
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom'; 

const socket = io('http://localhost:5000');

const MyMessages = ({ volunteerId }) => {
  const navigate = useNavigate(); 
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchMessages = useCallback(async () => {
    if (!volunteerId) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/messages/${volunteerId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת הודעות", err);
    } finally {
      setLoading(false);
    }
  }, [volunteerId]);

  useEffect(() => {
    fetchMessages();
    socket.on('new_message', (newMessage) => {
      if (newMessage.receiverId === volunteerId || newMessage.senderId === volunteerId) {
        setMessages((prev) => [newMessage, ...prev]);
      }
    });
    return () => socket.off('new_message');
  }, [volunteerId, fetchMessages]);
//לא קשור
  const handleSendMessage = async () => {
    if (!replyText.trim()) return;

    try {
      const replyData = {
        senderId: volunteerId,
        receiverId: selectedConversation.senderId,
        content: replyText,
      };

      await axios.post('http://localhost:5000/api/messages', replyData);
      setReplyText('');
     
    } catch (err) {
      console.error("שגיאה בשליחת תגובה", err);
      alert("חלה שגיאה בשליחת ההודעה");
    }
  };

  return (
    <div className="messages-section" style={{ padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh', position: 'relative', direction: 'rtl' }}>
      
    
      <button 
        onClick={() => navigate('/')} 
        style={backButtonStyle}
      >
        <ArrowRight size={20} />
        חזרה לטבלה
      </button>

      {/* כותרת */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center', color: '#005f8d', margin: 0 }}>
          <Mail style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
          הודעות שקיבלת מהקהילה
        </h2>
        {loading && <RefreshCw size={20} className="animate-spin" style={{ color: '#007bb5' }} />}
      </div>

    
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>עוד לא התקבלו פניות. זה יגיע! 😊</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg._id} 
              className="message-card" 
              onClick={() => setSelectedConversation(msg)}
              style={{ ...messageCardStyle, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#007bb5', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={16} /> {msg.senderId === volunteerId ? "אני" : (msg.senderId || "פונה אנונימית")}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#999', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} /> {new Date(msg.createdAt).toLocaleString('he-IL')}
                </span>
              </div>
              
              <p style={messageContentPreviewStyle}>
                {msg.content}
              </p>
            </div>
          ))
        )}
      </div>

     
      {selectedConversation && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <button onClick={() => setSelectedConversation(null)} style={closeButtonStyle}>
                <X size={20} />
              </button>
              <h3 style={{ margin: 0, color: '#005f8d' }}>שיחה עם {selectedConversation.senderId || "פונה"}</h3>
            </div>

            <div style={chatBodyStyle}>
              <div style={receivedMessageStyle}>
                <p style={{ margin: 0 }}>{selectedConversation.content}</p>
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                   {new Date(selectedConversation.createdAt).toLocaleTimeString('he-IL')}
                </span>
              </div>
            </div>

            <div style={chatInputAreaStyle}>
              <input 
                type="text" 
                placeholder="הקלידי תשובה..." 
                style={inputStyle} 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                style={{
                    ...sendButtonStyle, 
                    opacity: replyText.trim() ? 1 : 0.5,
                    cursor: replyText.trim() ? 'pointer' : 'not-allowed'
                }}
                disabled={!replyText.trim()}
              >
                <Send size={18} style={{ marginLeft: '5px' }} />
                שלחי
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const backButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#444',
  fontWeight: 'bold',
  marginBottom: '20px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
};

const messageContentPreviewStyle = {
  margin: '0', 
  color: '#333', 
  lineHeight: '1.6', 
  fontSize: '1.05rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const messageCardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  marginBottom: '15px',
  borderRight: '6px solid #007bb5',
  textAlign: 'right',
  transition: 'transform 0.2s',
};

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' };
const modalContentStyle = { backgroundColor: 'white', width: '100%', maxWidth: '500px', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '70vh', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', direction: 'rtl' };
const modalHeaderStyle = { padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const chatBodyStyle = { flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' };
const receivedMessageStyle = { backgroundColor: 'white', padding: '12px', borderRadius: '12px 12px 0 12px', maxWidth: '80%', alignSelf: 'flex-start', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '10px' };
const chatInputAreaStyle = { padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' };
const inputStyle = { flex: 1, padding: '10px 15px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none' };
const sendButtonStyle = { backgroundColor: '#007bb5', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '25px', display: 'flex', alignItems: 'center' };
const closeButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#666' };

export default MyMessages;

