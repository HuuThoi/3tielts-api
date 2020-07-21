const db = require("../models/index");
const EUserTypes = require("../enums/EUserTypes")
const bcrypt = require("bcryptjs");


//Get all student
// exports.findAll = async (req, res) => {
//   try {
//     let { limit, offset } = req.params;

//     limit = parseInt(limit);
//     offset = parseInt(offset);
//     const length = await db.Student.find().countDocuments();

//     const data = await db.Student.find()
//       .limit(limit)
//       .skip((offset - 1) * limit)
//       .populate({
//         path: "userId",
//         // match: { isBlock: false },
//         select: ["-password", "-passwordHash"],
//       });

//     if (data.length > 0) {
//       return res.status(200).json({ data, length });
//     } else {
//       return res.status(400).json({ message: "Không tìm thấy dữ liệu." });
//     }
//   } catch (err) {
//     console.log("err: ", err);
//     return res.status(500).json({ message: "Có lỗi xảy ra" });
//   }
// };

exports.findAll = async (req, res) => {
  const students = [];
  try {
    await db.User.find({
      $or: [{ role: EUserTypes.STUDENT }, { wantToUpgrade: true }]
    })
      //.populate({
      // path: "userID",
      // select: "email"
      //})
      .sort({ wantToUpgrade: 1 }).exec(function (err, result) {
        console.log(result);

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
            dateExpire: result[i].dateExpire,
            wantToUpgrade: result[i].wantToUpgrade == true ? "True" : "False",
            birthdate: result[i].birthdate
          }
          students.push(obj);
        }
        return res.status(200).json({ data: students });
      });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.findById = async (req, res) => {
  try {
    db.User.findById(req.params.id)
      .then((student) => {
        if (!student) {
          return res.status(404).send({
            message: "Student not found with id " + req.params.id,
          });
        }
        const data = {
          address: student.address,
          birthdate: student.birthdate,
          gender: student.gender,
          email: student.email,
          username: student.username,
          isBlock: student.isBlock
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
    // var user = await db.User.findOne({ email: email });
    // if (user != null) {
    //   return res.status(400).json({ message: "Email is existed" })
    // };

    db.User.create({
      address: address,
      birthdate: birthdate,
      password: bcrypt.hashSync(password, 8),
      gender: gender,
      email: email,
      username: username,
      role: EUserTypes.STUDENT
    }, function (err, user) {
      if (err) {
        return res.status(500).json({ message: "error saving student" + err });
      } else {
        db.Student.create({
          userID: user._id
        });
        return res.json({ message: "Success" });
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
    })
      .then(student => {
        if (!student) {
          return res.status(404).send({
            message: "Student not found with id " + req.params.id
          });
        }
        res.send(student);
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
      function (err, student) {
        if (err) {
          res.send("error removing");
        } else {
          res.send({ message: "Student deleted successfully!" });
        }
      }
    );
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};

exports.upgradeStudent = async (req, res) => {
  try {
    db.User.findByIdAndUpdate(req.params.id, {
      $set: {
        role: EUserTypes.STUDENT,
      }
    })
      .then(student => {
        if (!student) {
          return res.status(404).send({
            message: "Note not found with id " + req.params.id
          });
        }
        res.json({ message: "Block student successfully" });
      })
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",

    })
  }
}