const mongoose = require("mongoose");

const FeedbackDetailSchema = mongoose.Schema(
  {
    teacherID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    feedbackID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
  },
  {
    timestamps: true,
  }
);

const FeedbackDetail = mongoose.model("FeedbackDetail", FeedbackDetailSchema);
module.exports = FeedbackDetail;
