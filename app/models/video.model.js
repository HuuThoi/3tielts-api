const mongoose = require("mongoose");

const UploadSchema = mongoose.Schema({
    url: {
        type: String,
    },
    desc: {
        type: String,
    },
    originalName: {
        type: String,
    },
    resourceType: {
        type: String,
    },
    teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    duration: String
}, {
    timestamps: true,
});

const Upload = mongoose.model("Upload", UploadSchema);
module.exports = Upload;