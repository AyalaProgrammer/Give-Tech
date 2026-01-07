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
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
      methods: ["GET", "POST"]
    }
  });
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ מחובר ל-MongoDB Atlas'))
    .catch(err => console.error('❌ שגיאה בחיבור:', err));

const path = require('path');

const volunteerPath = path.join(__dirname, 'routes', 'volunteerRoutes.js');
const messagePath = path.join(__dirname, 'routes', 'messageRoutes.js');

console.log("Attempting to load routes from:", volunteerPath);

const volunteerRoutes = require(volunteerPath);
const messageRoutes = require(messagePath)(io);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/messages', messageRoutes);

// הפעלה
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 השרת והסוקט רצים בפורט ${PORT}`));