const EUserType = require("../enums/EUserTypes");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var validator = require("validator");

const saltRounds = 10;

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            // required: true,
            // unique: false,
            // lowercase: true,
            // validate: (value) => {
            //     if (!validator.isEmail(value)) {
            //         throw new Error({ error: "Invalid Email address" });
            //     }
            // },
        },
        password: { type: String, required: true, minLength: 7 },
        passwordHash: String,
        avatar: String,
        phone: String,
        birthdate: Date,
        googleID: String,
        facebookID: String,
        address: String,
        role: {
            type: String,
            default: EUserType.STANDARD,
        },
        gender: String,
        isBlock: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        wantToUpgrade: {
            type: Boolean,
            default: false,
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
        },
        number: {
            type: Number,
            default: 0,
        },
        district: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "District",
        },
        tests: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "MockingTest",
            },
            grades: {
                type: Number,
                default: 0
            },
            timeLeft: {
                type: Number,
                default: 3600,
            },
            status: {
                type: Number,
                default: 0,
            },
            answerKeys: {
                type: Array,
                default: [],
            }

        },],
        interestedItems: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document",
            },
        },],
        courseList: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        },],
        resetLink: {
            data: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.setPasswordHash = function (password) {
    this.passwordHash = bcrypt.hashSync(password, saltRounds);
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model("Users", UserSchema);
