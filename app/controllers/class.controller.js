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

  const classes = [];
  try {
    if (userData.role == EUserTypes.ADMIN) {
      await Class.find()
        .populate({
          path: "categoryID",
          select: 'name'
          // match: { isBlock: false },
        })
        .populate({
          path: "courseID",
          select: 'name'
          // match: { isBlock: false },
        }).exec(function (err, result) {
          if (err) {
            res.status(500).json({ message: err })
          }
          for (let i = 0; i < result.length; i++) {
            let obj = {
              id: result[i]._id,
              name: result[i].name,
              status: result[i].status == true ? "Active" : "InActive",
              categoryName: result[i].categoryID != null ? result[i].categoryID.name : null,
              dateOpening: result[i].dateOpening,
              dateClosed: result[i].dateClosed,
              courseName: result[i].courseID != null ? result[i].courseID.name : null
            }
            classes.push(obj);
          }
          return res.status(200).json({ data: classes });
        });
    }
    else if (userData.role == EUserTypes.Teacher) {
      classes = await Class.find({ lecturer: { $in: userData.id } })
        .populate({
          path: "categoryID",
        })
        .populate({
          path: "courseID",
        }).exec(function (err, result) {
          if (err) {
            res.status(500).json({ message: err })
          }
          for (let i = 0; i < result.length; i++) {
            let obj = {
              id: result[i]._id,
              name: result[i].name,
              status: result[i].status == true ? "Active" : "InActive",
              categoryName: result[i].categoryID != null ? result[i].categoryID.name : null,
              dateOpening: result[i].dateOpening,
              dateClosed: result[i].dateClosed,
              courseName: result[i].courseID != null ? result[i].courseID.name : null
            }
            classes.push(obj);
          }
          return res.status(200).json({ data: classes });
        });
    } else if (userData.role == EUserTypes.STUDENT) {
      classes = await Class.find({ studentList: { $in: userData.id } })
        .populate({
          path: "categoryID",
          select: "name"
        })
        .populate({
          path: "courseID",
        }).exec(function (err, result) {
          if (err) {
            res.status(500).json({ message: err })
          }
          for (let i = 0; i < result.length; i++) {
            let obj = {
              id: result[i]._id,
              name: result[i].name,
              status: result[i].status == true ? "Active" : "InActive",
              categoryName: result[i].categoryID != null ? result[i].categoryID.name : null,
              dateOpening: result[i].dateOpening,
              dateClosed: result[i].dateClosed,
              courseName: result[i].courseID != null ? result[i].courseID.name : null
            }
            classes.push(obj);
          }
          return res.status(200).json({ data: classes });
        });
    }
    // return res.status(200).json({ data: classes });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
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

exports.getAllClassesInDayForStudent = async (req, res) => {
  const classes = [];
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0);

  let end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 59, 59);

  let query = { createdAt: { $gte: start, $lt: end } };

  try {

    classes = await Class.find({ studentList: { $in: userData.id }, query })
      .populate({
        path: "categoryID",
        select: "name"
      })
      .populate({
        path: "courseID",
      }).exec(function (err, result) {
        if (err) {
          res.status(500).json({ message: err })
        }
        for (let i = 0; i < result.length; i++) {
          let obj = {
            id: result[i]._id,
            name: result[i].name,
            categoryType: result[i].categoryID.type,
            dateOpening: result[i].dateOpening,
          }
          classes.push(obj);
        }

        // return data {classes in Cate 1, classé in cate 2}
        return res.status(200).json({ data: classes });
      });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.getAllClassesInDayForTeacher = async (req, res) => {
  const userData = req.userData;

  const classes = [];
  try {
    if (userData.role == EUserTypes.ADMIN) {
      await Class.find()
        .populate({
          path: "categoryID",
          select: 'name'
          // match: { isBlock: false },
        })
        .populate({
          path: "courseID",
          select: 'name'
          // match: { isBlock: false },
        }).exec(function (err, result) {
          if (err) {
            res.status(500).json({ message: err })
          }
          for (let i = 0; i < result.length; i++) {
            let obj = {
              id: result[i]._id,
              name: result[i].name,
              status: result[i].status == true ? "Active" : "InActive",
              categoryName: result[i].categoryID != null ? result[i].categoryID.name : null,
              dateOpening: result[i].dateOpening,
              dateClosed: result[i].dateClosed,
              courseName: result[i].courseID != null ? result[i].courseID.name : null
            }
            classes.push(obj);
          }
          return res.status(200).json({ data: classes });
        });
    }
    else if (userData.role == EUserTypes.Teacher) {
      classes = await Class.find({ lecturer: { $in: userData.id } })
        .populate({
          path: "categoryID",
        })
        .populate({
          path: "courseID",
        }).exec(function (err, result) {
          if (err) {
            res.status(500).json({ message: err })
          }
          for (let i = 0; i < result.length; i++) {
            let obj = {
              id: result[i]._id,
              name: result[i].name,
              status: result[i].status == true ? "Active" : "InActive",
              categoryName: result[i].categoryID != null ? result[i].categoryID.name : null,
              dateOpening: result[i].dateOpening,
              dateClosed: result[i].dateClosed,
              courseName: result[i].courseID != null ? result[i].courseID.name : null
            }
            classes.push(obj);
          }
          return res.status(200).json({ data: classes });
        });
    } else if (userData.role == EUserTypes.STUDENT) {
      classes = await Class.find({ studentList: { $in: userData.id } })
        .populate({
          path: "categoryID",
          select: "name"
        })
        .populate({
          path: "courseID",
        }).exec(function (err, result) {
          if (err) {
            res.status(500).json({ message: err })
          }
          for (let i = 0; i < result.length; i++) {
            let obj = {
              id: result[i]._id,
              name: result[i].name,
              status: result[i].status == true ? "Active" : "InActive",
              categoryName: result[i].categoryID != null ? result[i].categoryID.name : null,
              dateOpening: result[i].dateOpening,
              dateClosed: result[i].dateClosed,
              courseName: result[i].courseID != null ? result[i].courseID.name : null
            }
            classes.push(obj);
          }
          return res.status(200).json({ data: classes });
        });
    }
    // return res.status(200).json({ data: classes });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};
