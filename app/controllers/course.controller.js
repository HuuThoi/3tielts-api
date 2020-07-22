const db = require("../models/index");
const { ObjectID } = require("mongodb");
const EUserTypes = require("../enums/EUserTypes");

exports.findAll = async (req, res) => {
  const courses = [];
  try {
    await db.Course.find()
      .populate({
        path: "lecturer",
        select: "username",
      })
      .exec(function (err, result) {
        if (err) {
          res.status(500).json({ message: err });
        }
        for (let i = 0; i < result.length; i++) {
          let obj = {
            id: result[i]._id,
            name: result[i].name,
            shortDesc: result[i].shortDesc,
            content: result[i].content,
            new: result[i].new == true ? "Lớp mới" : "",
            tuition: result[i].tuition,
            lecturer: result[i].lecturer ? result[i].lecturer.username : null,
            category: result[i].category,
            dateStart: result[i].dateStart,
            dateEnd: result[i].dateEnd,
            isConfirmed: result[i].isConfirmed
              ? "Đã xác nhận"
              : "Chưa xác nhận",
          };
          courses.push(obj);
        }
        return res.status(200).json({ data: courses });
      });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.findAllByTeacherID = async (req, res) => {
  const userData = req.userData;
  const courses = [];
  try {
    if (userData.role == EUserTypes.TEACHER) {
      await db.Course.find({ lecturer: { $in: userData.id } })
        .populate({
          path: "lecturer",
          select: "username",
        })
        .exec(function (err, result) {
          if (err) {
            res.status(500).json({ message: err });
          }
          for (let i = 0; i < result.length; i++) {
            let obj = {
              id: result[i]._id,
              name: result[i].name,
              shortDesc: result[i].shortDesc,
              content: result[i].content,
              new: result[i].new == true ? "Lớp mới" : "",
              tuition: result[i].tuition,
              lecturer: result[i].lecturer ? result[i].lecturer.username : null,
              category: result[i].category,
              dateStart: result[i].dateStart,
              dateEnd: result[i].dateEnd,
              isConfirmed: result[i].isConfirmed
                ? "Đã xác nhận"
                : "Chưa xác nhận",
            };
            courses.push(obj);
          }
          return res.status(200).json({ data: courses });
        });
    } else if (userData.role == EUserTypes.ADMIN) {
      await db.Course.find()
        .populate({
          path: "lecturer",
          select: "username",
        })
        .exec(function (err, result) {
          if (err) {
            res.status(500).json({ message: err });
          }
          for (let i = 0; i < result.length; i++) {
            let obj = {
              id: result[i]._id,
              name: result[i].name,
              shortDesc: result[i].shortDesc,
              content: result[i].content,
              new: result[i].new == true ? "Lớp mới" : "",
              tuition: result[i].tuition,
              lecturer: result[i].lecturer ? result[i].lecturer.username : null,
              category: result[i].category,
              dateStart: result[i].dateStart,
              dateEnd: result[i].dateEnd,
              isConfirmed: result[i].isConfirmed
                ? "Đã xác nhận"
                : "Chưa xác nhận",
            };
            courses.push(obj);
          }
          return res.status(200).json({ data: courses });
        });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.findByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courses = await db.Course.findOne({
      _id: id,
      isConfirmed: true,
    }).populate({
      path: "categoryID",
    });

    if (courses) {
      const teacher = await db.User.findOne({
        _id: courses.lecturer,
        role: EUserTypes.TEACHER,
      });

      return res
        .status(200)
        .json({ data: courses, teacher: teacher ? teacher.username : null });
    } else {
      return res.status(400).json({ message: "Không tồn tại khóa hoc" });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

exports.create = async (req, res) => {
  const {
    name,
    shortDesc,
    content,
    categoryID,
    tuition,
    lecturer,
    dateStart,
    dateEnd,
  } = req.body;

  let model = {
    name: name,
    shortDesc: shortDesc,
    content: content,
    categoryID: categoryID,
    tuition: tuition,
    dateStart: dateStart,
    dateEnd: dateEnd,
    lecturer: lecturer,
    isConfirmed: true,
  };

  if (!name || !shortDesc || !content) {
    return res.status(400).send({
      message: "name anf content not empty.",
    });
  }
  try {
    const data = await db.Course.findOne({ name });

    if (data) {
      return res
        .status(400)
        .json({ message: "Khóa học đã tồn tại, nhập khóa học khác" });
    } else {
      console.log("BODY", req.body);
      const course = new db.Course(model);
      const result = await course.save();
      if (result) {
        return res.status(200).json({ message: "Tạo khóa học thành công." });
      } else {
        return res.status(400).json({ message: "Tạo khóa học thất bại." });
      }
    }
  } catch {
    return res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra, vui lòng thử lại." });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    shortDesc,
    content,
    categoryID,
    tuition,
    lecture,
    dateStart,
    dateEnd,
  } = req.body;

  try {
    const course = await db.Course.findOne({ _id: id, isConfirmed: true });
    if (course == null) {
      return res.status(404).json({ message: "Not found course" + id });
    } else {
      const result = await db.Course.findOneAndUpdate(
        { _id: id },
        { $set: req.body }
      );
      if (result) {
        const data = await db.Course.findOne({ _id: result._id });
        if (data) {
          return res
            .status(200)
            .json({ message: "Cập nhật course năng thành công.", data });
        }
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "Đã có lỗi xảy ra.", err });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const course = await db.Course.findById({ _id: id });
  if (course == null) {
    return res.status(404).json({ message: "Not found course" + id });
  }
  try {
    const result = await db.Course.findOneAndDelete({ _id });
    if (result) {
      return res
        .status(200)
        .json({ message: "Xóa course thành công.", data: result });
    } else {
      return res.status(400).json({ message: "Không tìm thấy course." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Đã có lỗi xảy ra." + err });
  }
};

exports.getDropdown = async (req, res) => {
  try {
    let courses = await db.Course.find({ isConfirmed: true }).select({
      _id: 1,
      name: 1,
    });
    return res.status(200).json({ data: courses });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.findNewCoures = async (req, res) => {
  try {
    const courses = await db.Course.find({ isNew: true, isConfirmed: true })
      .limit(2)
      .populate({ path: "categoryID" });
    if (courses) {
      return res.status(200).json({ data: courses });
    } else {
      return res.status(400).json({ message: "Không tồn tại khóa học mới" });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

//get all temp
exports.getAllCurriculumByCourseId = async (req, res) => {
  const id = req.params.id;
  try {
    const course = await db.Course.findOne({
      _id: ObjectID(id),
      isConfirmed: true,
    }).populate({
      path: "curriculums",
      populate: ["linkVideo", "linkDoc"],
    });
    if (course == null) {
      return res.status(404).json({ message: "Not found course " + id });
    }

    //will be tested in future
    const curriculumsByCourseId = course.curriculums;
    // const data = await db.Curriculum.find()

    return res.status(200).json({
      data: curriculumsByCourseId,
    });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.getDiligenceDateInCourse = async (req, res) => {
  const id = req.params.id;
  var course = await db.Course.findById({ _id: ObjectID(id) });
  if (course == null) {
    return res.status(404).json({ message: "Not found course " + id });
  }
  //get list day in diligence
  var diligence = await db.StudentCourseDiligence.findOne({
    userId: req.userData.id,
    courseId: ObjectID(id),
  });

  console.log(diligence);

  var list = diligence != null ? diligence.listDateLearning : null;
  return res.status(200).json({ data: list });
};

exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await db.Curriculum.findById({ _id: id }).populate({
      path: "linkVideo",
    });
    if (data) {
      //update diligence
      var diligence = await db.StudentCourseDiligence.findOne({
        userId: req.userData.id,
        courseId: data.courseID,
      });
      if (diligence != null) {
        const date = new Date();
        const index = date.getDate();
        diligence.listDateLearning[index] = true;
        await diligence.save();
      }

      return res.status(200).json({ data: data });
    } else {
      return res.status(400).json({ message: "Không tồn tại tài khoản." });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

exports.getMyCourse = async (req, res) => {
  const courses = [];
  try {
    await db.Course.find({
      isConfirmed: true,
      studentList: { $in: req.userData.id },
    })
      .populate({
        path: "lecturer",
        select: "username",
      })
      .exec(function (err, result) {
        if (err) {
          res.status(500).json({ message: err });
        }
        for (let i = 0; i < result.length; i++) {
          if (
            result[i].dateEnd &&
            (new Date().getTime() - result[i].dateEnd.getTime()) /
              (60000 * 60 * 24) <
              0
          ) {
            let obj = {
              id: result[i]._id,
              name: result[i].name,
              shortDesc: result[i].shortDesc,
              tuition: result[i].tuition,
              lecturer: result[i].lecturer ? result[i].lecturer.username : null,
              category: result[i].category,
              dateStart: result[i].dateStart,
              dateEnd: result[i].dateEnd,
            };
            courses.push(obj);
          }
        }
        console.log(courses);
        return res.status(200).json({ data: courses });
      });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.teacherCreate = async (req, res) => {
  const {
    name,
    shortDesc,
    content,
    categoryID,
    tuition,
    dateStart,
    dateEnd,
  } = req.body;

  const lecturer = req.userData.id;
  let model = {
    name: name,
    shortDesc: shortDesc,
    content: content,
    categoryID: categoryID,
    tuition: tuition,
    dateStart: dateStart,
    dateEnd: dateEnd,
    lecturer: lecturer,
  };

  if (!name || !shortDesc || !content) {
    return res.status(400).send({
      message: "name anf content not empty.",
    });
  }
  try {
    const data = await db.Course.findOne({ name });

    if (data) {
      return res
        .status(400)
        .json({ message: "Khóa học đã tồn tại, nhập khóa học khác" });
    } else {
      console.log("BODY", req.body);
      const course = new db.Course(model);
      const result = await course.save();
      if (result) {
        return res
          .status(200)
          .json({ message: "Tạo khóa học thành công.", course: req.body });
      } else {
        return res.status(400).json({ message: "Tạo khóa học thất bại." });
      }
    }
  } catch {
    return res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra, vui lòng thử lại." });
  }
};

exports.confirmCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await db.Course.findById({ _id: id, isConfirmed: true });
    if (course == null) {
      return res.status(404).json({ message: "Not found course" + id });
    } else {
      if (course.isConfirmed) {
        return res.status(200).json({});
      } else {
        const result = await db.Course.findOneAndUpdate(
          { _id: id },
          { $set: { isConfirmed: true } }
        );
        if (result) {
          const data = await db.Course.findOne({ _id: result._id });
          if (data) {
            return res
              .status(200)
              .json({ message: "Xác nhận khóa học thành công.", data });
          }
        }
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "Đã có lỗi xảy ra.", err });
  }
};
