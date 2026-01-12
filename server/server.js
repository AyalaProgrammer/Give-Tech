require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// התיקון הקריטי: עדכון ה-origin לפורט 5173 (Vite)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"], // מאשרים את שני הפורטים ליתר ביטחון
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true
      }
});

// Middleware - גם כאן כדאי להגדיר את ה-CORS בצורה מפורשת
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

// התחברות ל-MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/giveTech')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ייבוא הראוטים
const volunteerRoutes = require('./routes/volunteerRoutes');

// כאן אנחנו מזריקים את ה-io לראוט של ההודעות
const messageRoutes = require('./routes/messageRoutes')(io); 

// שימוש בראוטים
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/messages', messageRoutes);

// טיפול בשגיאות כללי
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'משהו השתבש בשרת!' });
});

// חשוב: מריצים את ה-server ולא את ה-app כדי ש-Socket.io יעבוד
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});