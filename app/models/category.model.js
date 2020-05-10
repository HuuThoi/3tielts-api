const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const CategorySchema = mongoose.Schema(
  {
    name: String,
    icons: String,
    level: Number,
    status: Boolean,
    // typeID: Number,
   
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Category', CategorySchema);
