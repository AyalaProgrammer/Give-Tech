// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Mail, Clock, User } from 'lucide-react';

// const MyMessages = ({ volunteerId }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/messages/${volunteerId}`);
//         setMessages(res.data);
//       } catch (err) {
//         console.error("שגיאה בטעינת הודעות", err);
//       }
//     };
//     if (volunteerId) fetchMessages();
//   }, [volunteerId]);

//   return (
//     <div className="messages-section" style={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
//       <h2 style={{ textAlign: 'center', color: '#005f8d', marginBottom: '30px' }}>
//         <Mail style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
//         הודעות שקיבלת מהקהילה
//       </h2>

//       <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//         {messages.length === 0 ? (
//           <p style={{ textAlign: 'center', color: '#666' }}>עוד לא התקבלו פניות. זה יגיע! 😊</p>
//         ) : (
//           messages.map((msg) => (
//             <div key={msg._id} className="message-card" style={messageCardStyle}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//                 <span style={{ fontWeight: 'bold', color: '#007bb5' }}>
//                   <User size={16} /> {msg.senderId}
//                 </span>
//                 <span style={{ fontSize: '0.8rem', color: '#999' }}>
//                   <Clock size={14} /> {new Date(msg.createdAt).toLocaleDateString('he-IL')}
//                 </span>
//               </div>
//               <p style={{ margin: '0', color: '#333', lineHeight: '1.6' }}>{msg.content}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// const messageCardStyle = {
//   background: 'white',
//   padding: '20px',
//   borderRadius: '12px',
//   boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
//   marginBottom: '15px',
//   borderRight: '5px solid #007bb5', // פס כחול בצד של GiveTech
//   textAlign: 'right',
//   direction: 'rtl'
// };

// export default MyMessages;




// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { Mail, Clock, User, RefreshCw } from 'lucide-react';
// import { io } from 'socket.io-client';
// const socket = io('http://localhost:5000');

// const MyMessages = ({ volunteerId }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // 1. טעינה ראשונית של הודעות מה-DB
//     fetchMessages();

//     // 2. האזנה להודעות חדשות בזמן אמת
//     socket.on('new_message', (newMessage) => {
//       // אם ההודעה החדשה מיועדת אליי
//       if (newMessage.receiverId === volunteerId) {
//         setMessages((prev) => [newMessage, ...prev]);
//       }
//     });

//     return () => socket.off('new_message'); // ניקוי כשסוגרים את הדף
//   }, [volunteerId]);
  
//   // ... שאר הקוד שלך

// const MyMessages = ({ volunteerId }) => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchMessages = useCallback(async () => {
//     if (!volunteerId) return;
    
//     try {
//       setLoading(true);
//       // הדפסה לבדיקה - תוכלי לראות ב-F12 מה ה-ID שנשלח
//       console.log("מושך הודעות עבור מתנדבת ID:", volunteerId);
      
//       const res = await axios.get(`http://localhost:5000/api/messages/${volunteerId}`);
//       setMessages(res.data);
//     } catch (err) {
//       console.error("שגיאה בטעינת הודעות", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [volunteerId]);

//   useEffect(() => {
//     fetchMessages();
    
//     // ריענון אוטומטי כל 10 שניות כדי לראות הודעות חדשות מיד
//     const interval = setInterval(fetchMessages, 10000);
//     return () => clearInterval(interval);
//   }, [fetchMessages]);

//   return (
//     <div className="messages-section" style={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
//         <h2 style={{ textAlign: 'center', color: '#005f8d', margin: 0 }}>
//           <Mail style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
//           הודעות שקיבלת מהקהילה
//         </h2>
//         {loading && <RefreshCw size={20} className="animate-spin" style={{ color: '#007bb5' }} />}
//       </div>

//       <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//         {messages.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '12px' }}>
//             <p style={{ color: '#666', fontSize: '1.1rem' }}>עוד לא התקבלו פניות למזהה זה. זה יגיע! 😊</p>
//             <small style={{ color: '#ccc' }}>ID: {volunteerId}</small>
//           </div>
//         ) : (
//           messages.map((msg) => (
//             <div key={msg._id} className="message-card" style={messageCardStyle}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//                 <span style={{ fontWeight: 'bold', color: '#007bb5', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                   <User size={16} /> {msg.senderId || "פונה אנונימית"}
//                 </span>
//                 <span style={{ fontSize: '0.8rem', color: '#999', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                   <Clock size={14} /> {new Date(msg.createdAt).toLocaleString('he-IL')}
//                 </span>
//               </div>
//               <p style={{ margin: '0', color: '#333', lineHeight: '1.6', fontSize: '1.05rem' }}>{msg.content}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// const messageCardStyle = {
//   background: 'white',
//   padding: '20px',
//   borderRadius: '12px',
//   boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
//   marginBottom: '15px',
//   borderRight: '5px solid #007bb5',
//   textAlign: 'right',
//   direction: 'rtl'
// };

// export default MyMessages;



// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { Mail, Clock, User, RefreshCw } from 'lucide-react';
// import { io } from 'socket.io-client';

// // חיבור לסוקט - ודאי שהשרת שלך רץ בפורט 5000
// const socket = io('http://localhost:5000');

// const MyMessages = ({ volunteerId }) => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // פונקציה למשיכת הודעות מהדאטה-בייס
//   const fetchMessages = useCallback(async () => {
//     if (!volunteerId) return;
//     try {
//       setLoading(true);
//       const res = await axios.get(`http://localhost:5000/api/messages/${volunteerId}`);
//       setMessages(res.data);
//     } catch (err) {
//       console.error("שגיאה בטעינת הודעות", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [volunteerId]);

//   useEffect(() => {
//     // 1. טעינה ראשונית
//     fetchMessages();

//     // 2. האזנה להודעות חדשות בזמן אמת (Socket)
//     socket.on('new_message', (newMessage) => {
//       // עדכון הרשימה רק אם ההודעה מיועדת למתנדבת הנוכחית
//       if (newMessage.receiverId === volunteerId) {
//         setMessages((prev) => [newMessage, ...prev]);
//       }
//     });

//     // ניקוי המאזין כשהקומפוננטה נסגרת
//     return () => socket.off('new_message');
//   }, [volunteerId, fetchMessages]);

//   return (
//     <div className="messages-section" style={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
//         <h2 style={{ textAlign: 'center', color: '#005f8d', margin: 0 }}>
//           <Mail style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
//           הודעות שקיבלת מהקהילה
//         </h2>
//         {loading && <RefreshCw size={20} className="animate-spin" style={{ color: '#007bb5' }} />}
//       </div>

//       <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//         {messages.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '12px' }}>
//             <p style={{ color: '#666', fontSize: '1.1rem' }}>עוד לא התקבלו פניות. זה יגיע! 😊</p>
//           </div>
//         ) : (
//           messages.map((msg) => (
//             <div key={msg._id} className="message-card" style={messageCardStyle}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//                 <span style={{ fontWeight: 'bold', color: '#007bb5', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                   <User size={16} /> {msg.senderId || "פונה אנונימית"}
//                 </span>
//                 <span style={{ fontSize: '0.8rem', color: '#999', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                   <Clock size={14} /> {new Date(msg.createdAt).toLocaleString('he-IL')}
//                 </span>
//               </div>
//               <p style={{ margin: '0', color: '#333', lineHeight: '1.6', fontSize: '1.05rem' }}>{msg.content}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// const messageCardStyle = {
//   background: 'white',
//   padding: '20px',
//   borderRadius: '12px',
//   boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
//   marginBottom: '15px',
//   borderRight: '5px solid #007bb5',
//   textAlign: 'right',
//   direction: 'rtl'
// };

// export default MyMessages;


// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { Mail, Clock, User, RefreshCw, X, Send } from 'lucide-react'; // הוספתי אייקון Send
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5000');

// const MyMessages = ({ volunteerId }) => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedConversation, setSelectedConversation] = useState(null);
  
//   // --- חדש: State לטקסט של התגובה ---
//   const [replyText, setReplyText] = useState('');

//   const fetchMessages = useCallback(async () => {
//     if (!volunteerId) return;
//     try {
//       setLoading(true);
//       const res = await axios.get(`http://localhost:5000/api/messages/${volunteerId}`);
//       setMessages(res.data);
//     } catch (err) {
//       console.error("שגיאה בטעינת הודעות", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [volunteerId]);

//   useEffect(() => {
//     fetchMessages();
//     socket.on('new_message', (newMessage) => {
//       // אם ההודעה קשורה למתנדבת (היא המקבלת או השולחת) - נעדכן את הרשימה
//       if (newMessage.receiverId === volunteerId || newMessage.senderId === volunteerId) {
//         setMessages((prev) => [newMessage, ...prev]);
//       }
//     });
//     return () => socket.off('new_message');
//   }, [volunteerId, fetchMessages]);

//   // --- הפונקציה שביקשת לעדכן ---
//   const handleSendMessage = async () => {
//     if (!replyText.trim()) return; // לא שולחים הודעה ריקה

//     try {
//       const replyData = {
//         senderId: volunteerId, // את השולחת
//         receiverId: selectedConversation.senderId, // הפונה המקורית היא המקבלת
//         content: replyText,
//       };

//       // 1. שליחה לשרת כדי שישמור בדאטה-בייס
//       await axios.post('http://localhost:5000/api/messages', replyData);

//       // 2. ניקוי תיבת הטקסט
//       setReplyText('');
      
//       // הערה: ברגע שהשרת ישמור, הוא ישדר בסוקט וההודעה תופיע אצלך אוטומטית ברשימה!
//     } catch (err) {
//       console.error("שגיאה בשליחת תגובה", err);
//       alert("חלה שגיאה בשליחת ההודעה");
//     }
//   };

//   return (
//     <div className="messages-section" style={{ padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh', position: 'relative' }}>
      
//       {/* כותרת */}
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
//         <h2 style={{ textAlign: 'center', color: '#005f8d', margin: 0 }}>
//           <Mail style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
//           הודעות שקיבלת מהקהילה
//         </h2>
//         {loading && <RefreshCw size={20} className="animate-spin" style={{ color: '#007bb5' }} />}
//       </div>

//       {/* רשימת המלבנים */}
//       <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//         {messages.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '12px' }}>
//             <p style={{ color: '#666', fontSize: '1.1rem' }}>עוד לא התקבלו פניות. זה יגיע! 😊</p>
//           </div>
//         ) : (
//           messages.map((msg) => (
//             <div 
//               key={msg._id} 
//               className="message-card" 
//               onClick={() => setSelectedConversation(msg)}
//               style={{ ...messageCardStyle, cursor: 'pointer' }}
//             >
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//                 <span style={{ fontWeight: 'bold', color: '#007bb5', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                   <User size={16} /> {msg.senderId === volunteerId ? "אני" : (msg.senderId || "פונה אנונימית")}
//                 </span>
//                 <span style={{ fontSize: '0.8rem', color: '#999', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                   <Clock size={14} /> {new Date(msg.createdAt).toLocaleString('he-IL')}
//                 </span>
//               </div>
              
//               <p style={{ 
//                 margin: '0', 
//                 color: '#333', 
//                 lineHeight: '1.6', 
//                 fontSize: '1.05rem',
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis'
//               }}>
//                 {msg.content}
//               </p>
//             </div>
//           ))
//         )}
//       </div>

//       {/* --- Modal הצ'אט --- */}
//       {selectedConversation && (
//         <div style={modalOverlayStyle}>
//           <div style={modalContentStyle}>
//             <div style={modalHeaderStyle}>
//               <button onClick={() => setSelectedConversation(null)} style={closeButtonStyle}>
//                 <X size={20} />
//               </button>
//               <h3 style={{ margin: 0, color: '#005f8d' }}>שיחה עם {selectedConversation.senderId || "פונה"}</h3>
//             </div>

//             <div style={chatBodyStyle}>
//               <div style={receivedMessageStyle}>
//                 <p style={{ margin: 0 }}>{selectedConversation.content}</p>
//                 <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
//                    {new Date(selectedConversation.createdAt).toLocaleTimeString('he-IL')}
//                 </span>
//               </div>
//             </div>

//             {/* --- עדכון כאן: אזור הקלט והכפתור --- */}
//             <div style={chatInputAreaStyle}>
//               <input 
//                 type="text" 
//                 placeholder="הקלידי תשובה..." 
//                 style={inputStyle} 
//                 value={replyText} // מחובר ל-State
//                 onChange={(e) => setReplyText(e.target.value)} // מעדכן את ה-State
//                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // שליחה באנטר
//               />
//               <button 
//                 onClick={handleSendMessage} // מחובר לפונקציית השליחה
//                 style={{
//                    ...sendButtonStyle, 
//                    opacity: replyText.trim() ? 1 : 0.5,
//                    cursor: replyText.trim() ? 'pointer' : 'not-allowed'
//                 }}
//                 disabled={!replyText.trim()}
//               >
//                 <Send size={18} style={{ marginLeft: '5px' }} />
//                 שלחי
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- Styles (נשארים אותו דבר) ---
// const messageCardStyle = {
//   background: 'white',
//   padding: '20px',
//   borderRadius: '12px',
//   boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
//   marginBottom: '15px',
//   borderRight: '5px solid #007bb5',
//   textAlign: 'right',
//   direction: 'rtl',
//   transition: 'transform 0.2s',
// };

// const modalOverlayStyle = {
//   position: 'fixed',
//   top: 0, left: 0, right: 0, bottom: 0,
//   backgroundColor: 'rgba(0,0,0,0.5)',
//   display: 'flex', justifyContent: 'center', alignItems: 'center',
//   zIndex: 2000,
//   padding: '20px'
// };

// const modalContentStyle = {
//   backgroundColor: 'white',
//   width: '100%',
//   maxWidth: '500px',
//   borderRadius: '16px',
//   display: 'flex', flexDirection: 'column',
//   height: '70vh',
//   boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
//   direction: 'rtl'
// };

// const modalHeaderStyle = { padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
// const chatBodyStyle = { flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' };
// const receivedMessageStyle = { backgroundColor: 'white', padding: '12px', borderRadius: '12px 12px 0 12px', maxWidth: '80%', alignSelf: 'flex-start', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '10px' };
// const chatInputAreaStyle = { padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' };
// const inputStyle = { flex: 1, padding: '10px 15px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none' };
// const sendButtonStyle = { backgroundColor: '#007bb5', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '25px', display: 'flex', alignItems: 'center' };
// const closeButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#666' };

// export default MyMessages;




import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Mail, Clock, User, Send, X } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const MyMessages = ({ volunteerId }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchMessages = useCallback(async () => {
    if (!volunteerId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${volunteerId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת הודעות", err);
    }
  }, [volunteerId]);

  useEffect(() => {
    fetchMessages();
    socket.on('new_message', (msg) => {
      if (msg.receiverId === volunteerId || msg.senderId === volunteerId) {
        setMessages(prev => [msg, ...prev]);
      }
    });
    return () => socket.off('new_message');
  }, [volunteerId, fetchMessages]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      const replyData = {
        senderId: volunteerId,
        receiverId: selectedMsg.senderId, // עונה למי ששלח לי
        content: replyText
      };
      await axios.post('http://localhost:5000/api/messages', replyData);
      setReplyText('');
      setSelectedMsg(null);
      alert("התגובה נשלחה בהצלחה!");
    } catch (err) {
      alert("שגיאה בשליחה: " + err.message);
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#005f8d' }}><Mail /> הודעות מהקהילה</h2>
      
      <div style={{ maxWidth: '800px', margin: '30px auto' }}>
        {messages.map((msg) => (
          <div key={msg._id} 
               onClick={() => setSelectedMsg(msg)}
               style={messageCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: '#007bb5' }}>
                <User size={16} /> {msg.senderId === volunteerId ? "אני" : msg.senderId}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#999' }}>
                <Clock size={14} /> {new Date(msg.createdAt).toLocaleString('he-IL')}
              </span>
            </div>
            <p style={{ marginTop: '10px' }}>{msg.content}</p>
            {msg.senderId !== volunteerId && <small style={{color: '#007bb5'}}>לחצי כדי להשיב</small>}
          </div>
        ))}
      </div>

      {/* מודל תגובה */}
      {selectedMsg && selectedMsg.senderId !== volunteerId && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setSelectedMsg(null)} style={{float: 'left'}}><X /></button>
            <h3>השב ל: {selectedMsg.senderId}</h3>
            <textarea 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="כתבי את תגובתך כאן..."
              style={textareaStyle}
            />
            <button onClick={handleSendReply} style={sendButtonStyle}><Send size={18} /> שלחי תגובה</button>
          </div>
        </div>
      )}
    </div>
  );
};

// עיצובים
const messageCardStyle = {
  background: 'white', padding: '20px', borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '15px',
  borderRight: '5px solid #007bb5', cursor: 'pointer', textAlign: 'right', direction: 'rtl'
};

const modalStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
};

const modalContentStyle = {
  background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px', textAlign: 'right'
};

const textareaStyle = {
  width: '100%', height: '100px', marginTop: '15px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', direction: 'rtl'
};

const sendButtonStyle = {
  marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bb5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
};

export default MyMessages;