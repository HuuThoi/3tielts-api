const db = require("../models/index");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtSecretConfig = require("../config/jwt-secret.config");
const EUserTypes = require("../enums/EUserTypes")
var bcrypt = require("bcryptjs");

// Retrieving and return all admins to the database
exports.findAll = async (req, res) => {
    try {
        const admin = await db.User.find({ role: "Admin" });
        const data = admin.map((item) => {
            const v =
            {
                id: item._id,
                username: item.username,
                email: item.email,
                phone: item.phone,
                birthdate: item.birthdate,
                gender: item.gender,
                isBlock: item.isBlock ? "Bị khóa" : "Không"
            }

            return v;
        })
        res.status(200).json({ data: data })
    } catch (err) {
        console.log("err: ", err)
        res.status(500).send({ message: "Có lỗi xảy ra" })
    };
}

/**
 * {body: {email, password, username}}
 */
exports.create = async (req, res) => {
    const { email, password, username, birthdate, gender, address } = req.body;
    if (!email || !password) {
        return res.status(400).send({
            message: "email and password not empty."
        })
    }
    try {
        const data = await db.User.findOne({ email });
        if (data) {
            return res.status(400).json({ message: "Email đã tồn tại, vui lòng nhập email khác." });
        } else {
            db.User.create(
                {
                    username: username,
                    email: email,
                    birthdate: birthdate,
                    gender: gender,
                    address: address,
                    password: bcrypt.hashSync(password, 8),
                    role: "Admin"
                },
                (err, result) => {
                    if (err) {
                        res.status(400).json({ message: err });
                    } else {
                        res.json({ result: result });
                    }
                }
            );
        }
    } catch {
        return res.status(500).json({ message: "Đã có lỗi xảy ra, vui lòng thử lại." });
    }
}

exports.updateBlockStatus = async (req, res) => {
    var user = db.User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy admin" })

    user.updateOne({ isBlock: !user.isBlock }, (err, success) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        else {
            return res.status(200).json({ message: "success" })
        }
    })
}
