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



import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Mail, Clock, User, RefreshCw } from 'lucide-react';
import { io } from 'socket.io-client';

// חיבור לסוקט - ודאי שהשרת שלך רץ בפורט 5000
const socket = io('http://localhost:5000');

const MyMessages = ({ volunteerId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // פונקציה למשיכת הודעות מהדאטה-בייס
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
    // 1. טעינה ראשונית
    fetchMessages();

    // 2. האזנה להודעות חדשות בזמן אמת (Socket)
    socket.on('new_message', (newMessage) => {
      // עדכון הרשימה רק אם ההודעה מיועדת למתנדבת הנוכחית
      if (newMessage.receiverId === volunteerId) {
        setMessages((prev) => [newMessage, ...prev]);
      }
    });

    // ניקוי המאזין כשהקומפוננטה נסגרת
    return () => socket.off('new_message');
  }, [volunteerId, fetchMessages]);

  return (
    <div className="messages-section" style={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center', color: '#005f8d', margin: 0 }}>
          <Mail style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
          הודעות שקיבלת מהקהילה
        </h2>
        {loading && <RefreshCw size={20} className="animate-spin" style={{ color: '#007bb5' }} />}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '12px' }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>עוד לא התקבלו פניות. זה יגיע! 😊</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="message-card" style={messageCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#007bb5', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={16} /> {msg.senderId || "פונה אנונימית"}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#999', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} /> {new Date(msg.createdAt).toLocaleString('he-IL')}
                </span>
              </div>
              <p style={{ margin: '0', color: '#333', lineHeight: '1.6', fontSize: '1.05rem' }}>{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const messageCardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  marginBottom: '15px',
  borderRight: '5px solid #007bb5',
  textAlign: 'right',
  direction: 'rtl'
};

export default MyMessages;