const mongoose = require("mongoose");

const ShiftSchema = mongoose.Schema({
    timeIn: {
        type: Date,
        default: new Date(),
    },
    timeOut: {
        type: Date,
        default: new Date(),
    },
    classID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

const Shift = mongoose.model("Shift", ShiftSchema);
module.exports = Shift;