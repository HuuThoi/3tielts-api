const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema(
  {
    name: String,
    shortDesc: String,
    content: Number,
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    dateStart: {
      type: Date,
      default: Date,
    },
    dateEnd: {
      type: Date,
      default: Date,
    },
    tuition: String,
    schedule: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
      },
    ],
    studentList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
