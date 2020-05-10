const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    name: String,
    icons: String,
    level: Number,
    status: Boolean,
    typeID: Number,
    majorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Major",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", CategorySchema);
