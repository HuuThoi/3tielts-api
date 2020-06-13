const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    datePosted: Date,
    like: Number,
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
