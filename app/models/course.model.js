const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({

    // "name": "IELTS UNLIMITED",
    // "shortDesc": "Học tương tác không giới hạn",
    // "content": "PLA PLA PLA",
    // "new": true,
    // "category": "vở lòng" ,
    // "dateStart": "2019-01-01",
    // "dateEnd": "2019-03-01",
    // "tuition": 1000000,
<<<<<<< HEAD
   
=======



>>>>>>> development
    name: String,
    shortDesc: String,
    content: String,
    new: Boolean,
    category: {
        type: String,
        default: "vỡ lòng",//vỡ lòng/ sơ cấp/ trung cấp/ thượng cấp
    },
    dateStart: {
        type: Date,
        default: Date,
    },
    dateEnd: {
        type: Date,
        default: Date,
    },
    tuition: Number,
    schedule: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
    },],
<<<<<<< HEAD
    curriculums: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Curriculum",
        }
    ],
=======
>>>>>>> development
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    studentList: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },],
<<<<<<< HEAD
=======
    type: Number
>>>>>>> development
}, {
    timestamps: true,
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;