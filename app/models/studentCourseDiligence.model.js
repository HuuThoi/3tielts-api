const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StudentCourseDiligenceSchema = mongoose.Schema(
  {
    userId: String,
    courseId: String,
    listDateLearning: [
      {
        type: Boolean,
        default: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentCourseDiligence",
  StudentCourseDiligenceSchema
);
