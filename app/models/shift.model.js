const mongoose = require("mongoose");

const ShiftSchema = mongoose.Schema(
  {
    timeIn: {
      type: Date,
      default: new Date(),
    },
    timeOut: {
      type: Date,
      default: new Date(),
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

module.exports = mongoose.model("Shift", ShiftSchema);
