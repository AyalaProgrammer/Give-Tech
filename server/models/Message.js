// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema({
//   senderId: {
//     type: String, 
//     required: true
//   },
//   receiverId: {
//     type: String, 
//     required: true
//   },
//   content: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   isRead: {
//     type: Boolean,
//     default: false 
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now 
//   }
// });

// module.exports = mongoose.model('Message', MessageSchema);


const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  // senderId ישמש כמזהה הייחודי - כאן נשמור את המייל של הפונה
  senderId: { 
    type: String, 
    required: true,
    index: true // הוספת אינדקס לחיפוש מהיר יותר
  },
  // senderName ישמש לתצוגה בלבד - השם שהפונה הזינה בטופס
  senderName: { 
    type: String, 
    required: true,
    trim: true
  },
  // מזהה המתנדבת (ה-ID של ה-User ב-DB)
  receiverId: { type: String, required: true,index: true },
  receiverName: { type: String, required: true, trim: true },
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
}, { 
  // מוסיף אוטומטית שדות updatedAt ו-createdAt (אופציונלי אבל מומלץ)
  timestamps: true 
});

module.exports = mongoose.model('Message', MessageSchema);