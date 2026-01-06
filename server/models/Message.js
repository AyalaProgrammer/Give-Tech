// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema({
//   senderId: {
//     type: String, // אם אין לך עדיין טבלת משתמשים (Users), עדיף לשמור כאן פשוט שם או מייל כ-String
//     required: true
//   },
//   receiverId: {
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Volunteer', // שיניתי מ-'User' ל-'Volunteer' כדי שזה יתחבר לטבלה שלך
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


// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema({
//   senderId: {
//     type: String, // יכול להיות ID של מתנדבת או שם של פונה
//     required: true
//   },
//   receiverId: {
//     type: String, // שינינו מ-ObjectId ל-String כדי שיהיה גמיש
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


// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema({
//   senderId: {
//     type: String, // יכול להיות ID של מתנדבת או שם של פונה
//     required: true
//   },
//   receiverId: {
//     type: String, // שינינו ל-String כדי שיוכל לקבל גם שמות כמו "שרי"
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



// const MessageSchema = new mongoose.Schema({
//   senderId: { type: String, required: true },
//   receiverId: { type: String, required: true }, // חובה String!
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema({
//   senderId: { type: mongoose.Schema.Types.Mixed, required: true },
//   receiverId: { type: mongoose.Schema.Types.Mixed, required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// }, { strict: false }); // מאפשר לשמור שדות גם אם הם לא בדיוק לפי התבנית

// module.exports = mongoose.model('Message', MessageSchema);



// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema({
//   senderId: { type: String, required: true },
//   receiverId: { type: String, required: true },
//   content: { type: String, required: true },
//   isRead: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// }, { strict: false }); // זה המפתח! מאפשר לקבל כל פורמט של ID

// module.exports = mongoose.model('Message', MessageSchema);




const mongoose = require('mongoose');

// בדיקה אם המודל כבר קיים כדי למנוע את השגיאה שקיבלת
const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

// השורה הזו פותרת את הבעיה: היא בודקת אם המודל קיים לפני שהיא יוצרת אותו
module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);