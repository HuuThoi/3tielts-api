const mongoose = require("mongoose");

const CurriculumSchema = mongoose.Schema({
    name: String,
    status: Number,
    linkVideo: String,
    length: String,
    linkDoc: String,
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