const EUserType = require("../enums/EUserTypes");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

const MockingTestSchema = mongoose.Schema(
  {
    name: String,
    contents: String,
    audioLink: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.setPasswordHash = function (password) {
  this.passwordHash = bcrypt.hashSync(password, saltRounds);
};

UserSchema.methods.validatePassword = function (password) {
  if (!this.passwordHash) {
    return false;
  }
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model("MockingTest", MockingTestSchema);
//remember token
