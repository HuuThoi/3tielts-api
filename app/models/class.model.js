const mongoose = require("mongoose");

const ClassSchema = mongoose.Schema({
    name: String,
    lecturer: [
        {type:mongoose.Schema.Types.ObjectId, ref:'Teacher'},
    ],
    status: Boolean,
    content: String,
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    dateOpening: {
        type: Date,
        default: new Date(),
    },
    dateClosed: {
        type: Date,
        default: new Date(),
    },
    studentList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, ],
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
}, {
    timestamps: true,
});

const Class = mongoose.model("Class", ClassSchema);
module.exports = Class;