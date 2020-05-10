const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const CommentSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    datePosted: Number,
    like: Number,
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Comment', CommentSchema);
