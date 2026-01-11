const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');


router.get('/', async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/by-email/:email', async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({ 
            email: { $regex: new RegExp("^" + req.params.email + "$", "i") } 
        });
        if (!volunteer) return res.status(404).json({ message: "מתנדבת לא נמצאה" });
        res.json(volunteer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedVolunteer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const newVolunteer = new Volunteer(req.body);
        await newVolunteer.save();
        res.status(201).json(newVolunteer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;