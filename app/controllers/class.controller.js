const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Class = require("../models/class.model");
const EUserTypes = require("../enums/EUserTypes");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../models/index");

// admin will see all, teacher and student will see class they take/taked part in
exports.findAll = async (req, res) => {
  const userData = req.userData;

  try {
    const classes = [];
    if (userData.role == EUserTypes.ADMIN) {
      classes = await Class.find()
        .populate({
          path: "categoryID",
          // match: { isBlock: false },
        })
        .populate({
          path: "courseID",
          // match: { isBlock: false },
        });
    } else if (userData.role == EUserTypes.Teacher) {
      classes = await Class.find({ lecturer: { $in: userData.id } })
        .populate({
          path: "categoryID",
        })
        .populate({
          path: "courseID",
        });
    } else if (userData.role == EUserTypes.STUDENT) {
      classes = await Class.find({ studentList: { $in: userData.id } })
        .populate({
          path: "categoryID",
        })
        .populate({
          path: "courseID",
        });
    }

    if (classes) return res.status(200).json({ data: classes });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

/**
 * User register
 * @param {String} body._id
 * _id is id of User not _id of Student or Teacher
 */
exports.getInforClass = async (req, res) => {
  const { _id } = req.params;

  try {
    const _class = await Class.findOne({ _id });

    if (_class) {
      return res.status(200).json({ _class });
    } else {
      return res.status(400).json({ message: "Không tìm thấy thông tin lớp" });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

exports.create = async (req, res) => {
  try {
    db.Class.create(req.body, function (err, document) {
      if (err) {
        return res.json({ message: "Tạo lớp học thành công.", data: result });
      } else {
        res.send(document);
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};

exports.findById = async (req, res) => {
  try {
    Class.findById(req.params.id).then((shift) => {
      if (!shift) {
        return res.status(404).send({
          message: "Class not found with id " + req.params.id,
        });
      }
      res.json(shift);
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving class.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    db.Class.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.id,
        });
      }
      res.send(data);
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving documents.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    Class.findOneAndRemove(
      {
        _id: req.params.id,
      },
      function (err, shift) {
        if (err) {
          res.send("error removing");
        } else {
          res.send({ message: "Class deleted successfully!" });
        }
      }
    );
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving class.",
    });
  }
};

exports.getDropdown = async (req, res) => {
  try {
    const classes = await Class.find().select({ _id: 1, name: 1 });
    return res.status(200).json({ data: classes });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};
