
import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Send, ArrowRight, Mail } from 'lucide-react'; 
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom'; 

const socket = io('http://localhost:5000');

const MyMessages = ({ volunteerId, user }) => {
  const navigate = useNavigate(); 
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [activePartnerName, setActivePartnerName] = useState('');
  const [replyText, setReplyText] = useState('');
  const textareaRef = useRef(null);

  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [replyText]);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const messageDate = new Date(dateString);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    if (isToday) {
      return messageDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
  };

  const fetchConversations = useCallback(async () => {
    if (!volunteerId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/conversations/${volunteerId}`);
      setConversations(res.data || []);
    } catch (err) { console.error(err); }
  }, [volunteerId]);

  const fetchChatMessages = useCallback(async (partnerId) => {
    if (!volunteerId || !partnerId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${volunteerId}/${partnerId}`);
      setMessages(res.data || []);
    } catch (err) { console.error(err); }
  }, [volunteerId]);

  const markAsRead = async (partnerId) => {
    if (!partnerId) return;
    try {
      await axios.patch(`http://localhost:5000/api/messages/read-all/${volunteerId}/${partnerId}`);
      fetchConversations();
      socket.emit('messages_marked_read', { receiverId: volunteerId });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchConversations();
    const handleNewMsg = (data) => {
      fetchConversations();
      if (data.senderId === activePartnerId || data.receiverId === activePartnerId) {
        fetchChatMessages(activePartnerId);
        if (data.receiverId === volunteerId) markAsRead(activePartnerId);
      }
    };
    socket.on('new_message', handleNewMsg);
    return () => socket.off('new_message', handleNewMsg);
  }, [volunteerId, activePartnerId, fetchConversations, fetchChatMessages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activePartnerId) return;
    try {
      const newMessage = { 
        senderId: volunteerId, 
        senderName: user?.name || "מתנדבת", 
        receiverId: activePartnerId,
        receiverName: activePartnerName, 
        content: replyText 
      };
      await axios.post('http://localhost:5000/api/messages', newMessage);
      setReplyText('');
      fetchChatMessages(activePartnerId);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.chatCard}>
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <button onClick={() => navigate('/')} style={styles.backBtn}>
              <ArrowRight size={18}/> חזרה למסך הראשי
            </button>
            <h2 style={{margin:0, fontSize:'1.1rem', fontWeight:'700'}}>הודעות</h2>
          </div>
          <div style={styles.list}>
            {conversations.map(conv => (
              <div key={conv.partnerId} onClick={() => {
                  setActivePartnerId(conv.partnerId);
                  setActivePartnerName(conv.partnerName);
                  fetchChatMessages(conv.partnerId);
                  markAsRead(conv.partnerId);
                }} 
                style={{...styles.item, backgroundColor: activePartnerId === conv.partnerId ? '#F0F4FF' : 'transparent'}}>
                <div style={styles.avatar}>{(conv.partnerName || 'U')[0]}</div>
                <div style={{flex: 1, overflow: 'hidden'}}>
                  <div style={styles.itemTop}>
                    <span style={styles.partnerNameText}>{conv.partnerName}</span>
                    {conv.unreadCount > 0 && <span style={styles.unreadBadge}>חדש</span>}
                  </div>
                  <div style={styles.snippet}>{conv.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.main}>
          {activePartnerId ? (
            <>
              <div style={styles.msgArea}>
                {[...messages].reverse().map((m, index, array) => {
                  const isMine = m.senderId === volunteerId;
                  const isSameAsNext = index < array.length - 1 && array[index + 1].senderId === m.senderId;

                  return (
                    <div key={m._id} style={{
                         ...styles.bubbleWrapper, 
                         alignItems: isMine ? 'flex-end' : 'flex-start',
                         marginBottom: isSameAsNext ? '4px' : '15px' 
                    }}>
                      <div style={{
                           ...styles.bubble, 
                           backgroundColor: isMine ? '#2563EB' : '#E2E8F0', 
                           color: isMine ? '#fff' : '#1e293b',
                           borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                           boxShadow: isMine ? '0 1px 2px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
                      }}>
                        {m.content}
                      </div>
                      <span style={styles.timeLabel}>{formatTime(m.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
              <div style={styles.inputSection}>
                  <div style={styles.modernInputWrapper}>
                      <textarea 
                          ref={textareaRef}
                          value={replyText} 
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder={`התחילי להקליד...`} 
                          style={styles.actualInput}
                          rows={1}
                      />
                      <button onClick={handleSendMessage} style={styles.sendIconBtn}><Send size={20} /></button>
                  </div>
              </div>
            </>
          ) : (
            <div style={styles.empty}>
              <Mail size={60} color="#CBD5E1" strokeWidth={1.5}/>
              <h3 style={{marginTop: '20px', color: '#64748b'}}>תיבת ההודעות שלך</h3>
              <p>בחרי שיחה מהרשימה כדי להתחיל להתכתב</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  chatCard: {
    width: '96%', height: '92vh', maxWidth: '1600px',
    backgroundColor: '#fff', borderRadius: '24px',
    display: 'flex', overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.3)'
  },
  sidebar: { width: '350px', borderLeft: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' },
  sidebarHeader: { padding: '30px 25px', borderBottom: '1px solid #f8f9fa' },
  backBtn: { border: 'none', background: 'none', color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: '600', fontSize: '0.95rem' },
  list: { flex: 1, overflowY: 'auto' },
  item: { display: 'flex', alignItems: 'center', gap: '15px', padding: '20px 25px', cursor: 'pointer', transition: 'all 0.3s ease', borderBottom: '1px solid #fafafa' },
  itemTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  partnerNameText: { fontWeight: '700', color: '#1e293b', fontSize: '1rem' },
  avatar: { width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#EEF2FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
  snippet: { fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  unreadBadge: { backgroundColor: '#10b981', color: 'white', borderRadius: '8px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: '800' },
  main: { 
    flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc',
    backgroundImage: 'radial-gradient(#e2e8f0 0.5px, transparent 0.5px)', backgroundSize: '20px 20px'
  },
  msgArea: { 
    flex: 1, padding: '30px 50px', display: 'flex', flexDirection: 'column-reverse', 
    overflowY: 'auto', backgroundColor: '#f8fafc'
  },
  bubbleWrapper: { 
    display: 'flex', flexDirection: 'column', width: '100%'
  },
  bubble: { 
    padding: '10px 16px', 
    width: 'fit-content', 
    maxWidth: '70%', 
    fontSize: '0.95rem', 
    lineHeight: '1.4',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap'
  },
  timeLabel: { 
    fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px', alignSelf: 'inherit', margin: '0 5px 5px' 
  },
  inputSection: { 
    padding: '15px 50px 25px', 
    backgroundColor: 'transparent' 
  },
  modernInputWrapper: { 
    display: 'flex', 
    alignItems: 'flex-end', 
    backgroundColor: '#fff', 
    borderRadius: '25px', 
    padding: '10px 20px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
    border: '1px solid #e2e8f0',
    minHeight: '60px',
    gap: '12px',
    boxSizing: 'border-box'
  },
  actualInput: { 
    flex: 1, 
    border: 'none', 
    outline: 'none', 
    padding: '8px 0', 
    fontSize: '1rem', 
    background: 'transparent', 
    resize: 'none', 
    fontFamily: 'inherit',
    lineHeight: '1.5', 
    height: '30px',      
    maxHeight: '150px',  
    overflowY: 'hidden', 
    display: 'flex',
    alignItems: 'center'
  },
  sendIconBtn: { 
    background: '#2563EB', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '50%', 
    width: '40px', 
    height: '40px', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexShrink: 0,
    marginBottom: '2px', 
    padding: 0
  },
  empty: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textAlign: 'center' }
};

export default MyMessages;