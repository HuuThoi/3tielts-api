const db = require("../models/index");
const bcrypt = require("bcryptjs");
const EUserTypes = require("../enums/EUserTypes")
const mailTransporterOptions = require("../config/mail-options");
const nodemailer = require("nodemailer");

// exports.findAll = async (req, res) => {
//     try {
//         let { limit, offset } = req.params;

//         limit = parseInt(limit);
//         offset = parseInt(offset);
//         const length = await db.Teacher.find().countDocuments();

//         const data = await db.Teacher.find()
//             .limit(limit)
//             .skip((offset - 1) * limit);
//         return res.status(200).json({ data, length });

//     } catch (err) {
//         res.status(500).send({
//             message: err.message || "Some error occurred while retrieving shifts.",
//         });
//     }
// };

exports.findAll = async (req, res) => {
    const teachers = [];
    try {
        await db.User.find({ role: EUserTypes.TEACHER, isActive: true })
            .exec(function (err, result) {
                if (err) {
                    res.status(500).json({ message: err })
                }
                for (let i = 0; i < result.length; i++) {
                    let obj = {
                        id: result[i]._id,
                        username: result[i].username,
                        isBlocked: result[i].isBlock == true ? "True" : "False",
                        phone: result[i].phone,
                        email: result[i].email,
                        gender: result[i].gender,
                        address: result[i].address,
                        birthdate: result[i].birthdate
                    }
                    teachers.push(obj);
                }
                return res.status(200).json({ data: teachers });
            });
    } catch (err) {
        console.log("err: ", err);
        return res.status(500).json({ message: err });
    }
};

exports.findAllNoPaging = async (req, res) => {
    try {
        db.Teacher.find()
            .then((shifts) => {
                res.status(200).json(shifts);
            });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};

exports.findById = async (req, res) => {
    try {
        await db.User.findById(req.params.id)
            .then((teacher) => {
                if (!teacher) {
                    return res.status(404).send({
                        message: "Teacher not found with id " + req.params.id,
                    });
                }
                const data = {
                    address: teacher.address,
                    birthdate: teacher.birthdate,
                    gender: teacher.gender,
                    email: teacher.email,
                    username: teacher.username,
                    isBlock: teacher.isBlock
                }
                res.json(data);
            })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};

exports.create = async (req, res) => {
    const { address, birthdate, password, gender, email, username } = req.body;
    try {
        var _user = await db.User.findOne({ email: email });
        if (_user != null) {
            return res.status(400).json({ message: "Email is existed" })
        }

        db.User.create({
            address: address,
            birthdate: birthdate,
            password: bcrypt.hashSync(password, 8),
            gender: gender,
            email: email,
            username: username,
            role: EUserTypes.TEACHER
        }, function (err, user) {
            if (err) {
                return res.status(400).json({ message: err });
            } else {
                db.Teacher.create({
                    userID: user._id
                });
                //sendmail
                var transporter = nodemailer.createTransport(mailTransporterOptions.emailTransportOptions);
                var content = "";
                content += `<div>
                      <h2>Admin vừa tạo tài khoản cho bạn:</h2>
                      <h3>Username: ${user.username}</h3>
                      <h3>Password: ${password}</h3>
                      <h3 style="color:red">Vui lòng cập nhật mật khau ngay khi đăng nhập</h3>
                    </div>  
                    `;
                var mailOptions = {
                    from: `khactrieuhcmus@gmail.com`,
                    to: user.email,
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

                return res.send("Success");
            }
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};

exports.update = async (req, res) => {
    const { address, birthdate, gender, isBlock } = req.body;

    try {
        db.User.findByIdAndUpdate(req.params.id, {
            $set: {
                address: address,
                birthdate: birthdate,
                gender: gender,
                isBlock: isBlock
            }
        }, { new: true })
            .then(teacher => {
                if (!teacher) {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.id
                    });
                }
                res.send(teacher);
            })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};


exports.delete = async (req, res) => {
    try {
        db.User.findByIdAndUpdate(req.params.id, {
            $set: {
                isActive: false,
            }
        })
            .then(c => {
                if (!c) {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.id
                    });
                }
                res.json({ message: "Delete course successfully" });
            })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",
        });
    }
};

exports.blockTeacher = async (req, res) => {
    try {
        db.User.findByIdAndUpdate(req.params.id, {
            $set: {
                isBlock: true,
            }
        })
            .then(teacher => {
                if (!teacher) {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.id
                    });
                }
                res.json({ message: "Block teacher successfully" });
            })
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shifts.",

        })
    }
}

exports.getDropdown = async (req, res) => {
    try {
        let data = await db.User.find({ role: EUserTypes.TEACHER }).select({ _id: 1, username: 1 });
        return res.status(200).json({ data: data });
    } catch (err) {
        console.log("err: ", err);
        return res.status(500).json({ message: err });
    }
};