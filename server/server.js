// // // // const express = require('express');
// // // // const mongoose = require('mongoose');
// // // // const dotenv = require('dotenv');
// // // // const cors = require('cors');

// // // // // טעינת משתני הסביבה מקובץ ה-.env
// // // // dotenv.config();

// // // // const app = express();

// // // // // Middleware
// // // // app.use(cors());
// // // // app.use(express.json()); // מאפשר לשרת לקרוא JSON בגוף הבקשה (Body)

// // // // // התחברות ל-MongoDB Atlas
// // // // const mongoURI = process.env.MONGO_URI;

// // // // mongoose.connect(mongoURI)
// // // //     .then(() => console.log('✅ מחובר בהצלחה ל-MongoDB Atlas'))
// // // //     .catch(err => console.error('❌ שגיאה בהתחברות ל-MongoDB:', err));

// // // // // הגדרת פורט והרצת השרת

// // // // const Volunteer = require('./models/Volunteer');

// // // // // נתיב להוספת מתנדב חדש
// // // // app.post('/api/volunteers', async (req, res) => {
// // // //     try {
// // // //         const newVolunteer = new Volunteer(req.body);
// // // //         const savedVolunteer = await newVolunteer.save();
// // // //         res.status(201).json(savedVolunteer);
// // // //     } catch (err) {
// // // //         res.status(400).json({ message: err.message });
// // // //     }
// // // // });

// // // // // נתיב לקבלת כל המתנדבים
// // // // app.get('/api/volunteers', async (req, res) => {
// // // //     try {
// // // //         const volunteers = await Volunteer.find();
// // // //         res.json(volunteers);
// // // //     } catch (err) {
// // // //         res.status(500).json({ message: err.message });
// // // //     }
// // // // });

// // // // const PORT = process.env.PORT || 5000;
// // // // app.listen(PORT, () => {
// // // //     console.log(`🚀 השרת רץ על פורט ${PORT}`);
// // // // });

// // // // // נתיב בדיקה בסיסי
// // // // app.get('/', (req, res) => {
// // // //     res.send('השרת של GiveTech פועל!');
// // // // });

// // // const express = require('express');
// // // const mongoose = require('mongoose');
// // // const dotenv = require('dotenv');
// // // const cors = require('cors');
// // // const Volunteer = require('./models/Volunteer'); // וודאי שיצרת את התיקייה models והקובץ Volunteer.js

// // // dotenv.config();

// // // const app = express(); // כאן אנחנו מגדירים את ה"אפליקציה"

// // // // Middleware
// // // app.use(cors()); // מאפשר לריאקט (פורט 3000) לדבר עם השרת (פורט 5000)
// // // app.use(express.json());

// // // // התחברות ל-MongoDB
// // // mongoose.connect(process.env.MONGO_URI)
// // //     .then(() => console.log('✅ מחובר ל-MongoDB Atlas'))
// // //     .catch(err => console.error('❌ שגיאה בחיבור:', err));

// // // // --- נתיבי API ---

// // // // 1. קבלת כל המתנדבים (בשביל הטבלה)
// // // app.get('/api/volunteers', async (req, res) => {
// // //     try {
// // //         const volunteers = await Volunteer.find();
// // //         res.json(volunteers);
// // //     } catch (err) {
// // //         res.status(500).json({ message: err.message });
// // //     }
// // // });

// // // // 2. הוספת מתנדב חדש (בשביל הטופס שנבנה בהמשך)
// // // app.post('/api/volunteers', async (req, res) => {
// // //     try {
// // //         const newVolunteer = new Volunteer(req.body);
// // //         const savedVolunteer = await newVolunteer.save();
// // //         res.status(201).json(savedVolunteer);
// // //     } catch (err) {
// // //         res.status(400).json({ message: err.message });
// // //     }
// // // });

// // // // הרצת השרת
// // // const PORT = process.env.PORT || 5000;
// // // app.listen(PORT, () => {
// // //     console.log(`🚀 השרת פועל בפורט ${PORT}`);
// // // });

// // const express = require('express');
// // const mongoose = require('mongoose');
// // const dotenv = require('dotenv');
// // const cors = require('cors');
// // const Volunteer = require('./models/Volunteer'); // ייבוא המודל שיצרנו אתמול

// // dotenv.config();

// // const app = express(); // המשתנה app מייצג את השרת שלנו

// // // Middleware
// // app.use(cors()); // מאפשר ל-React לגשת לשרת
// // app.use(express.json()); // מאפשר לשרת לקרוא מידע בפורמט JSON מהטופס

// // // חיבור ל-MongoDB Atlas
// // mongoose.connect(process.env.MONGO_URI)
// //     .then(() => console.log('✅ מחובר בהצלחה ל-MongoDB Atlas'))
// //     .catch(err => console.error('❌ שגיאה בחיבור למסד הנתונים:', err));

// // // --- נתיבי ה-API (Routes) ---

// // // נתיב לקבלת כל המתנדבים (עבור הטבלה)
// // app.get('/api/volunteers', async (req, res) => {
// //     try {
// //         const volunteers = await Volunteer.find();
// //         res.json(volunteers);
// //     } catch (err) {
// //         res.status(500).json({ message: err.message });
// //     }
// // });

// // // נתיב להוספת מתנדב חדש (עבור הטופס AddVolunteer.js)
// // app.post('/api/volunteers', async (req, res) => {
// //     try {
// //         const newVolunteer = new Volunteer(req.body);
// //         const savedVolunteer = await newVolunteer.save();
// //         res.status(201).json(savedVolunteer); // החזרת המתנדב שנוצר בהצלחה
// //     } catch (err) {
// //         res.status(400).json({ message: "שגיאה בשמירת המתנדב: " + err.message });
// //     }
// // });

// // // הפעלת השרת
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //     console.log(`🚀 השרת פועל בפורט ${PORT}`);
// // });

// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const Volunteer = require('./models/Volunteer'); // ודאי שהקובץ הזה קיים בתיקיית models

// // טעינת הגדרות מקובץ ה-.env
// dotenv.config();

// const app = express(); // כאן אנחנו מגדירים את השרת

// // Middleware - הגדרות בסיסיות לשרת
// app.use(cors()); // מאפשר ל-React (פורט 5173) לדבר עם השרת (פורט 5000)
// app.use(express.json()); // מאפשר לשרת לקרוא את המידע מהטופס (JSON)

// // חיבור למסד הנתונים MongoDB Atlas
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('✅ מחובר בהצלחה ל-MongoDB Atlas'))
//     .catch(err => console.error('❌ שגיאה בחיבור ל-MongoDB:', err));

// // --- נתיבי API (Routes) ---

// // 1. קבלת כל המתנדבים להצגה בטבלה
// app.get('/api/volunteers', async (req, res) => {
//     try {
//         const volunteers = await Volunteer.find();
//         res.json(volunteers);
//     } catch (err) {
//         res.status(500).json({ message: "שגיאה במשיכת הנתונים: " + err.message });
//     }
// });

// // 2. הוספת מתנדב חדש מהטופס
// app.post('/api/volunteers', async (req, res) => {
//     try {
//         const newVolunteer = new Volunteer(req.body);
//         const savedVolunteer = await newVolunteer.save();
//         res.status(201).json(savedVolunteer);
//     } catch (err) {
//         res.status(400).json({ message: "שגיאה בשמירת המתנדב: " + err.message });
//     }
// });

// // הגדרת הפורט והרצת השרת
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 השרת שלך רץ על פורט ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Volunteer = require('./models/Volunteer');

dotenv.config();

const app = express(); // המשתנה app מייצג את השרת

// Middleware
app.use(cors());
app.use(express.json());

// חיבור ל-MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ מחובר ל-MongoDB Atlas'))
    .catch(err => console.error('❌ שגיאה בחיבור:', err));

// נתיבי API
app.get('/api/volunteers', async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/volunteers', async (req, res) => {
    try {
        const newVolunteer = new Volunteer(req.body);
        await newVolunteer.save();
        res.status(201).json(newVolunteer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 השרת רץ בפורט ${PORT}`));