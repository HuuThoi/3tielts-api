const mongoose = require("mongoose");

const ClassSchema = mongoose.Schema(
  {
    name: String,
    status: Number,
    content: Number,
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    dateOpening: {
      type: Date,
      default: new Date(),
    },
    studentList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", ClassSchema);
