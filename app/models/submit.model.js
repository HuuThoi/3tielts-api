const mongoose = require("mongoose");

const SubmitSchema = mongoose.Schema(
  {
    grade: String,
    respond: String,
    assignmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment"
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submit", SubmitSchema);
