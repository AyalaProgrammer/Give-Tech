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