const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema(
  {
    dateExpire: {
        type: Date,
        default: new Date(),
      },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", StudentSchema);
