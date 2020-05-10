const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Document = require("../models/document.model");
const EUserTypes = require("../enums/EUserTypes");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtSecretConfig = require("../../config/jwt-secret.config");

exports.findAll = async (req, res) => {
  try {
    const documents = await Document.find();

    if (documents) {
      return res.status(200).json({ data: documents });
    } else {
      return res.status(400).json({ message: "Không tồn tại bài đăng." });
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
exports.getInforDocument = async (req, res) => {
  const { _id } = req.params;

  try {
    const document = await Document.findOne({ _id })
      .populate({
        path: "CategoryID",
      })
      .populate({
        path: "AuthorID",
      });

    if (document) {
      return res.status(200).json({ document });
    } else {
      return res.status(400).json({ message: "Không tìm thấy thông tin bài đăng" });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

exports.create = async (req, res) => {
  const { name } = req.body;

  try {
    const newDocument = new Document({
      name,
    });

    const result = await newDocument.save();

    if (result) {
      return res
        .status(200)
        .json({ message: "Tạo bài đăng thành công.", data: result });
    } else {
      return res.status(400).json({ message: "Tạo bài đăng thất bại." });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};
