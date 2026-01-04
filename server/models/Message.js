const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: String, // אם אין לך עדיין טבלת משתמשים (Users), עדיף לשמור כאן פשוט שם או מייל כ-String
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Volunteer', // שיניתי מ-'User' ל-'Volunteer' כדי שזה יתחבר לטבלה שלך
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false 
  },
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('Message', MessageSchema);