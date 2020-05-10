const mongoose = require("mongoose");

const AbsenceSchema = mongoose.Schema(
  {
    reason: String,
    dateFrom: {
      type: Date,
      default: new Date(),
    },
    dateTo: {
      type: Date,
      default: new Date(),
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    classID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    status: Boolean
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Absence", AbsenceSchema);
