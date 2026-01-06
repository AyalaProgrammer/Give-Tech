const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    // השורה שהוספתי כדי שהמייל באמת יישמר במערכת:
    email: {
        type: String,
        required: false, // לא חובה
        default: null
    },
    helpArea: {
        type: String, 
        required: true
    },
    seniority: {
        type: Number, 
        required: true
    },
    experienceArea: {
        type: String, 
        required: true
    },
    technologies: {
        type: [String], 
        default: []
    },
    workPlace: {
        type: String
    },
    contactInfo: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);