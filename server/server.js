const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST", "PUT"] }
});

app.use(cors());
app.use(express.json());

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ מחובר ל-MongoDB Atlas'))
    .catch(err => console.error('❌ שגיאה בחיבור:', err));

// --- חיבור הראוטים החדשים ---
const volunteerRoutes = require('./routes/volunteerRoutes');
const messageRoutes = require('./routes/messageRoutes')(io); // מעבירים את io כאן

app.use('/api/volunteers', volunteerRoutes);
app.use('/api/messages', messageRoutes);

// הפעלה
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 השרת והסוקט רצים בפורט ${PORT}`));