// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const Volunteer = require('./models/Volunteer');

// dotenv.config();

// const app = express(); // המשתנה app מייצג את השרת

// // Middleware
// app.use(cors());
// app.use(express.json());

// // חיבור ל-MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('✅ מחובר ל-MongoDB Atlas'))
//     .catch(err => console.error('❌ שגיאה בחיבור:', err));

// // נתיבי API
// app.get('/api/volunteers', async (req, res) => {
//     try {
//         const volunteers = await Volunteer.find();
//         res.json(volunteers);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// app.post('/api/volunteers', async (req, res) => {
//     try {
//         const newVolunteer = new Volunteer(req.body);
//         await newVolunteer.save();
//         res.status(201).json(newVolunteer);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });
// // ייבוא המודל של ההודעות (תוודאי שהנתיב לקובץ נכון)
// const Message = require('./models/Message'); 

// // ראוט לשליחת הודעה חדשה
// app.post('/api/messages', async (req, res) => {
//     try {
//         const { senderId, receiverId, content } = req.body;
        
//         const newMessage = new Message({
//             senderId, // מי שולחת
//             receiverId, // ה-ID של המתנדבת מהטבלה
//             content // תוכן ההודעה
//         });

//         await newMessage.save();
//         res.status(201).json({ success: true, message: "ההודעה נשמרה!" });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// });

// // ראוט לקבלת כל ההודעות שנשלחו למתנדבת ספציפית
// app.get('/api/messages/:volunteerId', async (req, res) => {
//     try {
//         const messages = await Message.find({ receiverId: req.params.volunteerId })
//                                       .sort({ createdAt: -1 }); // מציג קודם את ההודעות החדשות ביותר
//         res.json(messages);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// // ראוט לקבלת הודעות עם פרטי המתנדבת
// app.get('/api/messages/:volunteerId', async (req, res) => {
//     try {
//         const messages = await Message.find({ receiverId: req.params.volunteerId })
//             .populate('receiverId', 'fullName email') // מושך אוטומטית את השם והמייל מהטבלה של המתנדבות
//             .sort({ createdAt: -1 });
            
//         res.json(messages);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// app.get('/api/volunteers/by-email/:email', async (req, res) => {
//     try {
//         const volunteer = await Volunteer.findOne({ email: req.params.email });
//         if (!volunteer) return res.status(404).json({ message: "מתנדבת לא נמצאה" });
//         res.json(volunteer);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 השרת רץ בפורט ${PORT}`));




// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const Volunteer = require('./models/Volunteer');
// const Message = require('./models/Message'); 

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // חיבור ל-MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('✅ מחובר ל-MongoDB Atlas'))
//     .catch(err => console.error('❌ שגיאה בחיבור:', err));

// // --- נתיבי מתנדבים ---

// app.get('/api/volunteers', async (req, res) => {
//     try {
//         const volunteers = await Volunteer.find();
//         res.json(volunteers);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// app.post('/api/volunteers', async (req, res) => {
//     try {
//         const newVolunteer = new Volunteer(req.body);
//         await newVolunteer.save();
//         res.status(201).json(newVolunteer);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // ראוט קריטי: מציאת מתנדבת לפי מייל בשביל ה-Login
// // app.get('/api/volunteers/by-email/:email', async (req, res) => {
// //     try {
// //         const volunteer = await Volunteer.findOne({ email: req.params.email });
// //         if (!volunteer) return res.status(404).json({ message: "מתנדבת לא נמצאה" });
// //         res.json(volunteer);
// //     } catch (err) {
// //         res.status(500).json({ message: err.message });
// //     }
// // });


// // ראוט למציאת מתנדבת לפי מייל (בשביל ה-Login)
// app.get('/api/volunteers/by-email/:email', async (req, res) => {
//     try {
//         // שימוש ב-RegExp כדי לוודא שהחיפוש לא רגיש לאותיות גדולות/קטנות
//         const volunteer = await Volunteer.findOne({ 
//             email: { $regex: new RegExp("^" + req.params.email + "$", "i") } 
//         });
        
//         if (!volunteer) {
//             return res.status(404).json({ message: "מתנדבת לא נמצאה" });
//         }
//         res.json(volunteer);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// // --- נתיבי הודעות ---

// // שליחת הודעה
// app.post('/api/messages', async (req, res) => {
//     try {
//         const { senderId, receiverId, content } = req.body;
//         const newMessage = new Message({ senderId, receiverId, content });
//         await newMessage.save();
//         res.status(201).json({ success: true, message: "ההודעה נשמרה!" });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// });

// // קבלת הודעות למתנדבת (מאוחד)
// app.get('/api/messages/:volunteerId', async (req, res) => {
//     try {
//         const messages = await Message.find({ receiverId: req.params.volunteerId })
//             .sort({ createdAt: -1 });
//         res.json(messages);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // עדכון פרטי מתנדבת קיימת
// app.put('/api/volunteers/:id', async (req, res) => {
//     try {
//         const updatedVolunteer = await Volunteer.findByIdAndUpdate(
//             req.params.id, 
//             req.body, 
//             { new: true } // מחזיר את האובייקט המעודכן
//         );
//         if (!updatedVolunteer) return res.status(404).json({ message: "מתנדבת לא נמצאה" });
//         res.json(updatedVolunteer);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 השרת רץ בפורט ${PORT}`));



// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const Volunteer = require('./models/Volunteer');
// const Message = require('./models/Message'); 

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // חיבור ל-MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('✅ מחובר ל-MongoDB Atlas'))
//     .catch(err => console.error('❌ שגיאה בחיבור:', err));

// // --- ראוטים למתנדבות ---

// // קבלת כל המתנדבות
// app.get('/api/volunteers', async (req, res) => {
//     try {
//         const volunteers = await Volunteer.find();
//         res.json(volunteers);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // מציאת מתנדבת לפי מייל (בשביל ה-Login)
// app.get('/api/volunteers/by-email/:email', async (req, res) => {
//     try {
//         const volunteer = await Volunteer.findOne({ 
//             email: { $regex: new RegExp("^" + req.params.email + "$", "i") } 
//         });
//         if (!volunteer) return res.status(404).json({ message: "מתנדבת לא נמצאה" });
//         res.json(volunteer);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // עדכון מתנדבת (חשוב לעריכת המייל!)
// app.put('/api/volunteers/:id', async (req, res) => {
//     try {
//         const updatedVolunteer = await Volunteer.findByIdAndUpdate(
//             req.params.id, 
//             req.body, 
//             { new: true }
//         );
//         if (!updatedVolunteer) return res.status(404).json({ message: "לא נמצאה מתנדבת לעדכון" });
//         res.json(updatedVolunteer);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // יצירת מתנדבת חדשה
// app.post('/api/volunteers', async (req, res) => {
//     try {
//         const newVolunteer = new Volunteer(req.body);
//         await newVolunteer.save();
//         res.status(201).json(newVolunteer);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // --- ראוטים להודעות ---

// app.post('/api/messages', async (req, res) => {
//     try {
//         const newMessage = new Message(req.body);
//         await newMessage.save();
//         res.status(201).json({ success: true, message: "ההודעה נשלחה!" });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// });

// app.get('/api/messages/:volunteerId', async (req, res) => {
//     try {
//         const messages = await Message.find({ receiverId: req.params.volunteerId }).sort({ createdAt: -1 });
//         res.json(messages);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 השרת רץ בפורט ${PORT}`));



// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');

// // ייבוא המודלים (וודאי שהקבצים קיימים בתיקיית models)
// const Volunteer = require('./models/Volunteer');
// const Message = require('./models/Message'); 

// dotenv.config();
// const app = express();

// // 1. הגדרת שרת HTTP וסוקטים
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST", "PUT"]
//     }
// });

// // 2. Middleware
// app.use(cors());
// app.use(express.json());

// // 3. חיבור ל-MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('✅ מחובר ל-MongoDB Atlas'))
//     .catch(err => console.error('❌ שגיאה בחיבור:', err));

// // --- ראוטים למתנדבות ---

// app.get('/api/volunteers', async (req, res) => {
//     try {
//         const volunteers = await Volunteer.find();
//         res.json(volunteers);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// app.get('/api/volunteers/by-email/:email', async (req, res) => {
//     try {
//         const volunteer = await Volunteer.findOne({ 
//             email: { $regex: new RegExp("^" + req.params.email + "$", "i") } 
//         });
//         if (!volunteer) return res.status(404).json({ message: "מתנדבת לא נמצאה" });
//         res.json(volunteer);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// app.put('/api/volunteers/:id', async (req, res) => {
//     try {
//         const updatedVolunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedVolunteer);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // --- ראוטים להודעות (החלק שמתקן את שגיאת 400) ---

// app.post('/api/messages', async (req, res) => {
//     try {
//         const { senderId, receiverId, content } = req.body;
        
//         // יצירת אובייקט הודעה חדש
//         const newMessage = new Message({
//             senderId: String(senderId),     // הפיכה למחרוזת ליתר ביטחון
//             receiverId: String(receiverId), // הפיכה למחרוזת ליתר ביטחון
//             content: content
//         });

//         await newMessage.save();

//         // שידור חי לכל מי שמחובר
//         io.emit('new_message', newMessage); 
        
//         res.status(201).json(newMessage);
//     } catch (err) {
//         console.error("❌ שגיאה בשמירת הודעה:", err.message);
//         res.status(400).json({ success: false, error: err.message });
//     }
// });

// // app.post('/api/messages', async (req, res) => {
// //     console.log("--- הודעה חדשה הגיעה לשרת ---");
// //     console.log("Body:", req.body); // נראה מה ריאקט שלח

// //     try {
// //         const newMessage = new Message(req.body);
// //         await newMessage.save();
        
// //         console.log("✅ ההודעה נשמרה בהצלחה!");
// //         io.emit('new_message', newMessage); 
// //         res.status(201).json(newMessage);
// //     } catch (err) {
// //         console.error("❌ שגיאה מפורטת של Mongoose:");
// //         console.error(err); // זה ידפיס בדיוק איזה שדה עושה בעיות
// //         res.status(400).json({ 
// //             success: false, 
// //             error: err.message,
// //             validationErrors: err.errors // זה יגיד לנו אם זה senderId או receiverId
// //         });
// //     }
// // });
// app.get('/api/messages/:volunteerId', async (req, res) => {
//     try {
//         const messages = await Message.find({ 
//             $or: [
//                 { receiverId: req.params.volunteerId },
//                 { senderId: req.params.volunteerId }
//             ]
//         }).sort({ createdAt: 1 }); // מיון מהישן לחדש כדי שיוצג כשיחה
        
//         res.json(messages);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 4. הפעלת השרת
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 השרת רץ בפורט ${PORT}`));



const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const Volunteer = require('./models/Volunteer');
const Message = require('./models/Message'); 

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ מחובר ל-MongoDB Atlas'))
    .catch(err => console.error('❌ שגיאה בחיבור:', err));

// --- ראוטים ---

// קבלת הודעות של מתנדבת (גם מה ששלחו לה וגם מה שהיא ענתה)
app.get('/api/messages/:volunteerId', async (req, res) => {
    try {
        const messages = await Message.find({ 
            $or: [
                { receiverId: req.params.volunteerId },
                { senderId: req.params.volunteerId }
            ]
        }).sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// שליחת הודעה / תגובה
app.post('/api/messages', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        io.emit('new_message', newMessage); 
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// מציאת מתנדבת לפי מייל
app.get('/api/volunteers/by-email/:email', async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({ 
            email: { $regex: new RegExp("^" + req.params.email + "$", "i") } 
        });
        res.json(volunteer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// קבלת כל המתנדבות (בשביל למלא את הטבלה הראשית)
app.get('/api/volunteers', async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.json(volunteers);
    } catch (err) {
        console.error("שגיאה במשיכת מתנדבות:", err);
        res.status(500).json({ message: err.message });
    }
});
const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 השרת רץ בפורט ${PORT}`));