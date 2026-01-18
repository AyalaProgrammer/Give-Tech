import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Mail, Clock, User, RefreshCw, X, Send, ArrowRight } from 'lucide-react'; 
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom'; 
import { Box, Typography, CircularProgress, Divider } from '@mui/material';

const socket = io('http://localhost:5000');

const MyMessages = ({ volunteerId }) => {
  const navigate = useNavigate(); 
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');

  // טעינת הודעות מהשרת
  const fetchMessages = useCallback(async () => {
    if (!volunteerId) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/messages/${volunteerId}`);
      // מיון: הודעות חדשות ביותר למעלה
      const sortedMessages = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(sortedMessages);
    } catch (err) {
      console.error("שגיאה בטעינת הודעות", err);
    } finally {
      setLoading(false);
    }
  }, [volunteerId]);

  useEffect(() => {
    fetchMessages();

    // האזנה להודעות חדשות בזמן אמת
    socket.on('new_message', (newMessage) => {
      if (newMessage.receiverId === volunteerId || newMessage.senderId === volunteerId) {
        setMessages((prev) => {
          // מניעת כפילויות אם ההודעה כבר קיימת
          if (prev.find(m => m._id === newMessage._id)) return prev;
          return [newMessage, ...prev];
        });
      }
    });

    return () => socket.off('new_message');
  }, [volunteerId, fetchMessages]);

  // שליחת תגובה
  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    try {
      // לוגיקה לקביעת הנמען: אם אני קיבלתי את ההודעה, אני עונה לשולח. 
      // אם אני שלחתי אותה במקור, אני עונה למקבל המקורי.
      const targetReceiverId = selectedConversation.senderId === volunteerId 
        ? selectedConversation.receiverId 
        : selectedConversation.senderId;

      const replyData = {
        senderId: volunteerId,
        receiverId: targetReceiverId,
        content: replyText,
      };

      const res = await axios.post('http://localhost:5000/api/messages', replyData);
      
      // עדכון הסטייט המקומי מיידית
      setMessages((prev) => [res.data, ...prev]);
      setReplyText('');
      setSelectedConversation(null); // סגירת המודל לאחר שליחה
      
    } catch (err) {
      console.error("שגיאה בשליחת תגובה", err);
      alert("חלה שגיאה בשליחת ההודעה");
    }
  };

  return (
    <Box sx={{ padding: '40px', backgroundColor: '#f4f7f9', minHeight: '100vh', direction: 'rtl' }}>
      
      {/* כפתור חזרה */}
      <button onClick={() => navigate('/volunteersTable')} style={backButtonStyle}>
        <ArrowRight size={20} />
        חזרה לרשימת המתנדבות
      </button>

      {/* כותרת דף */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#005f8d', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <Mail size={32} />
          הודעות ופניות
        </Typography>
        {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
      </Box>

      {/* רשימת ההודעות */}
      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        {messages.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', p: 5, bgcolor: 'white', borderRadius: 4, boxShadow: 1 }}>
            <Typography variant="h6" color="textSecondary">עוד לא התקבלו פניות. זה יגיע! 😊</Typography>
          </Box>
        ) : (
          messages.map((msg) => {
            const isFromMe = msg.senderId === volunteerId;
            return (
              <Box 
                key={msg._id} 
                onClick={() => setSelectedConversation(msg)}
                sx={{ 
                  ...messageCardStyle, 
                  borderRight: isFromMe ? '6px solid #999' : '6px solid #007bb5',
                  opacity: isFromMe ? 0.85 : 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', color: isFromMe ? '#666' : '#007bb5', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <User size={16} /> 
                    {isFromMe ? `שלחת ל: ${msg.receiverId}` : `מאת: ${msg.senderId || "פונה אנונימית"}`}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Clock size={14} /> {new Date(msg.createdAt).toLocaleString('he-IL')}
                  </Typography>
                </Box>
                <Typography sx={{ color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {msg.content}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>

      {/* מודל שיחה (Chat Modal) */}
      {selectedConversation && (
        <Box sx={modalOverlayStyle}>
          <Box sx={modalContentStyle}>
            <Box sx={modalHeaderStyle}>
              <button onClick={() => setSelectedConversation(null)} style={closeButtonStyle}><X size={20} /></button>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#005f8d' }}>
                {selectedConversation.senderId === volunteerId ? "פרטי הודעה שנשלחה" : "מענה לפנייה"}
              </Typography>
            </Box>

            <Box sx={chatBodyStyle}>
              {/* בועת ההודעה המקורית */}
              <Box sx={selectedConversation.senderId === volunteerId ? sentMessageStyle : receivedMessageStyle}>
                <Typography variant="body2">{selectedConversation.content}</Typography>
                <Typography sx={{ fontSize: '0.65rem', opacity: 0.7, mt: 0.5, textAlign: 'left' }}>
                  {new Date(selectedConversation.createdAt).toLocaleTimeString('he-IL')}
                </Typography>
              </Box>
              
              <Typography variant="caption" sx={{ textAlign: 'center', color: '#999', my: 2 }}>
                סוף היסטוריית הודעה
              </Typography>
            </Box>

            <Box sx={chatInputAreaStyle}>
              <input 
                type="text" 
                placeholder="הקלידי תגובה..." 
                style={inputStyle} 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage} 
                style={{...sendButtonStyle, opacity: replyText.trim() ? 1 : 0.5}} 
                disabled={!replyText.trim()}
              >
                <Send size={18} style={{ marginLeft: '8px' }} />
                שליחה
              </button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// --- עיצובים (Styles) ---

const backButtonStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff',
  border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px',
  cursor: 'pointer', color: '#444', fontWeight: 'bold', marginBottom: '20px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontFamily: 'inherit'
};

const messageCardStyle = {
  background: 'white', padding: '20px', borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '15px',
  textAlign: 'right', cursor: 'pointer', transition: 'all 0.2s ease',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 15px rgba(0,0,0,0.1)' }
};

const modalOverlayStyle = { 
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
  backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', 
  justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px' 
};

const modalContentStyle = { 
  backgroundColor: 'white', width: '100%', maxWidth: '500px', 
  borderRadius: '16px', display: 'flex', flexDirection: 'column', 
  height: '70vh', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' 
};

const modalHeaderStyle = { 
  padding: '15px 20px', borderBottom: '1px solid #eee', 
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8f9fa' 
};

const chatBodyStyle = { 
  flex: 1, padding: '20px', overflowY: 'auto', 
  backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' 
};

const receivedMessageStyle = { 
  backgroundColor: 'white', padding: '12px 16px', borderRadius: '16px 16px 0 16px', 
  maxWidth: '85%', alignSelf: 'flex-start', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', mb: 2 
};

const sentMessageStyle = { 
  backgroundColor: '#007bb5', color: 'white', padding: '12px 16px', 
  borderRadius: '16px 16px 16px 0', maxWidth: '85%', alignSelf: 'flex-end', 
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', mb: 2 
};

const chatInputAreaStyle = { padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', bgcolor: 'white' };
const inputStyle = { flex: 1, padding: '12px 18px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', fontSize: '1rem' };
const sendButtonStyle = { backgroundColor: '#007bb5', color: 'white', border: 'none', padding: '0 20px', borderRadius: '25px', display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' };
const closeButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#666' };

export default MyMessages;