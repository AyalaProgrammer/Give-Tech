require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true
    }
});


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());


mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/giveTech')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));


app.get('/api/clear-messages', async (req, res) => {
    try {
   
        await mongoose.connection.collection('messages').deleteMany({});
        res.send('<h1>✅ הצלחה!</h1><p>כל ההודעות נמחקו מהמסד נתונים. עכשיו אפשר להתחיל דף חלק ונקי.</p>');
    } catch (err) {
        res.status(500).send('<h1>❌ שגיאה</h1><p>' + err.message + '</p>');
    }
});


const volunteerRoutes = require('./routes/volunteerRoutes');
const messageRoutes = require('./routes/messageRoutes')(io); 


app.use('/api/volunteers', volunteerRoutes);
app.use('/api/messages', messageRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'משהו השתבש בשרת!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});