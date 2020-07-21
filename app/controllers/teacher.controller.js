const db = require("../models/index");
const bcrypt = require("bcryptjs");
const EUserTypes = require("../enums/EUserTypes")

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
        await db.User.find({ role: EUserTypes.TEACHER })
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
        db.User.findById(req.params.id)
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
        // db.User.findOne({ email: email }, function (err, result) {
        //     if (result) {
        //         res.status(400).json({ message: "Email is existed" })
        //     }
        // });

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
                //return res.send("error saving teacher");
            } else {
                db.Teacher.create({
                    userID: user._id
                });
                //return res.send("Success");
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
        db.User.findOneAndRemove({
            _id: req.params.id,
        },
            function (err, teacher) {
                if (err) {
                    res.send("error removing");
                } else {
                    res.send({ message: "Teacher deleted successfully!" });
                }
            }
        );
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