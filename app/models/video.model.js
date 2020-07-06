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
    }
}, {
    timestamps: true,
});

const Upload = mongoose.model("Upload", UploadSchema);
module.exports = Upload;