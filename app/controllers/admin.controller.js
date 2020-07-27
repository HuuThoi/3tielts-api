const db = require("../models/index");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtSecretConfig = require("../config/jwt-secret.config");
const EUserTypes = require("../enums/EUserTypes")
var bcrypt = require("bcryptjs");
const mailTransporterOptions = require("../config/mail-options");
const nodemailer = require("nodemailer");

// Retrieving and return all admins to the database
exports.findAll = async (req, res) => {
    try {
        const admin = await db.User.find({ role: "Admin", isActive: true });
        const data = admin.map((item) => {
            const v =
            {
                id: item._id,
                username: item.username,
                email: item.email,
                phone: item.phone,
                birthdate: item.birthdate,
                gender: item.gender,
                isBlock: item.isBlock ? "Bị khóa" : "Không",
                address: item.address
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
                    passwordHash: bcrypt.hashSync(password, 8),
                    role: "Admin",
                    isActive: true,
                },
                (err, result) => {
                    if (err) {
                        return res.status(400).json({ message: err });
                    } else {
                        //sendmail
                        var transporter = nodemailer.createTransport(mailTransporterOptions.emailTransportOptions);
                        var content = "";
                        content += `<div>
                      <h2>Admin vừa tạo tài khoản cho bạn:</h2>
                      <h3>Username: ${result.username}</h3>
                      <h3>Password: ${password}</h3>
                      <h3 style="color:red">Vui lòng cập nhật mật khau ngay khi đăng nhập</h3>
                    </div>  
                    `;
                        var mailOptions = {
                            from: `khactrieuhcmus@gmail.com`,
                            to: result.email,
                            subject: "Gửi xác nhận",
                            html: content,
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                return res.status(400).json({ success: false });
                            } else {
                                console.log("Email sent: " + info.response);
                                return res.json({ success: true });
                            }
                        });
                        return res.json({ result: result });
                    }
                }
            );
        }
    } catch {
        return res.status(500).json({ message: "Đã có lỗi xảy ra, vui lòng thử lại." });
    }
}

exports.updateBlockStatus = async (req, res) => {
    try {
        db.User.findByIdAndUpdate(req.params.id, {
            $set: {
                isBlock: true,
            }
        })
            .then(admin => {
                if (!admin) {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.id
                    });
                }
                res.json({ message: "Block admin successfully" });
            })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",

        })
    }
}
