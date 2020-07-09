const mongoose = require("mongoose");

const CurriculumSchema = mongoose.Schema({
    name: String,
    status: Number,
    linkVideo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upload",
    },
    length: String,
    linkDoc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upload",
    },
    linkHomework: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MockingTest",
    },
    isDoneHomework: {
        type: Boolean,
        default: false
    },
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }

}, {
    timestamps: true,
});

const Curriculum = mongoose.model("Curriculum", CurriculumSchema);
module.exports = Curriculum;