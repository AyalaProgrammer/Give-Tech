// const mongoose = require('mongoose');

// const volunteerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   yearsOfExperience: { type: Number, required: true },
//   helpArea: [String], // מערך של תחומים כמו "ייעוץ", "הכנה לראיון"
//   technologies: [String], // שפות תכנות
//   workPlace: String,
//   contactInfo: String,
//   notes: String
// });

// module.exports = mongoose.model('Volunteer', volunteerSchema);

// const mongoose = require('mongoose');

// const VolunteerSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true
//     },
//     helpArea: {
//         type: String, // למשל: "עריכת קו"ח באנגלית"
//         required: true
//     },
//     seniority: {
//         type: Number, // וותק בשנים
//         required: true
//     },
//     experienceArea: {
//         type: String, // תחום ניסיון (למשל: Full Stack)
//         required: true
//     },
//     technologies: {
//         type: [String], // מערך של טכנולוגיות (למשל: ["React", "Node.js"])
//         default: []
//     },
//     workPlace: {
//         type: String
//     },
//     contactInfo: {
//         type: String,
//         required: true
//     },
//     notes: {
//         type: String
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Volunteer', VolunteerSchema);



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