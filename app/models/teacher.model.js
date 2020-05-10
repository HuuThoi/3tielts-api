const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema(
  {
    salary: Number,
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shifts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift",
      },
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
