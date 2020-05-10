const mongoose = require("mongoose");

const ResponseSchema = mongoose.Schema(
  {
    content: String,
    title: String,
    feedbackID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Response", ResponseSchema);
