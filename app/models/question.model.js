const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const UserSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    passwordHash: String,
    avatar: String,
    displayName: String,
    phone: String,
    birthdate: Date,
    googleID: String,
    facebookID: String,
   
    gender: String,
    isBlock: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
  
  },
  {
    timestamps: true
  }
);

UserSchema.methods.setPasswordHash = function(password) {
  this.passwordHash = bcrypt.hashSync(password, saltRounds);
};

UserSchema.methods.validatePassword = function(password) {
  if (!this.passwordHash) {
    return false;
  }
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
