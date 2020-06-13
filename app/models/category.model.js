const mongoose = require("mongoose");
const ETypes = require("../enums/ETypes");

const CategorySchema = mongoose.Schema(
  {
    name: String,
    icons: String,
    level: String,
    status: Boolean,
    typeID: {
      type: String,
      default: ETypes.NEWS,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
