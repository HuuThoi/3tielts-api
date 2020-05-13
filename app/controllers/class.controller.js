const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Class = require("../models/class.model");
const EUserTypes = require("../enums/EUserTypes");
const passport = require("passport");
const jwt = require("jsonwebtoken");
// const jwtSecretConfig = require("../../config/jwt-secret.config");

exports.findAll = async (req, res) => {
  try {
    const classes = await Class.find();

    if (classes) {
      return res.status(200).json({ data: classes });
    } else {
      return res.status(400).json({ message: "Không tồn tại lớp." });
    }
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
    const _class = await Class.findOne({ _id }).populate({
      path: "CourseID",
    });

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
  const { name } = req.body;

  try {
    const newClass = new Class({
      name,
    });

    const result = await newClass.save();

    if (result) {
      return res
        .status(200)
        .json({ message: "Tạo lớp học thành công.", data: result });
    } else {
      return res.status(400).json({ message: "Tạo lớp học thất bại." });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};

exports.update = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status().json({message:""});
  }
  const user = User.findOne()
};
