const mongoose = require("mongoose");

const VideoSchema = mongoose.Schema({
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

const Video = mongoose.model("Video", VideoSchema);
module.exports = Video;