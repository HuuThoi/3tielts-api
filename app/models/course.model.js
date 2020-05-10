const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const CourseSchema = mongoose.Schema(
  {
    name: String,
    shortDesc: String,
    content: String,
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
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    studentList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model('Course', CourseSchema);
