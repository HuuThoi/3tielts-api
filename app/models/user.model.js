// const EUserType = require("../enums/EUserTypes");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const saltRounds = 10;
// var Schema = mongoose.Schema;

// const UserSchema = new Schema(
//   {
//     displayName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       validate: (value) => {
//         if (!validator.isEmail(value)) {
//           throw new Error({ error: "Invalid Email address" });
//         }
//       },
//     },
//     password: { type: String, required: true, minLength: 7 },
//     passwordHash: String,
//     avatar: String,
//     phone: String,
//     birthdate: Date,
//     googleID: String,
//     facebookID: String,
//     adress: String,
//     typeID: {
//       type: Number,
//       default: EUserType.STUDENT,
//     },
//     gender: String,

//     isBlock: {
//       type: Boolean,
//       default: false,
//     },
//     isActive: {
//       type: Boolean,
//       default: false,
//     },
//     number: {
//       type: Number,
//       default: 0,
//     },
//     tests: [
//       {
//         _id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "MockingTest",
//         },
//         timein: {
//           type: Date,
//           default: new Date(),
//         },
//         timeout: {
//           type: Date,
//         },
//         isDone: {
//           type: Boolean,
//           default: false,
//         },
//       },
//     ],
//     interestedItems: [
//       {
//         _id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Document",
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// UserSchema.methods.setPasswordHash = function (password) {
//   this.passwordHash = bcrypt.hashSync(password, saltRounds);
// };

// UserSchema.methods.validatePassword = function (password) {
//   if (!this.passwordHash) {
//     return false;
//   }
//   return bcrypt.compareSync(password, this.passwordHash);
// };

// module.exports = mongoose.model("User", UserSchema);