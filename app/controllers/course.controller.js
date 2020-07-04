const db = require("../models/index");

exports.findAll = async (req, res) => {
  try {
    const data = await db.Course.find();
    return res.status(200).json({ data: data });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
};

exports.findByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courses = await db.Course.findById({ _id: id }).populate({
      path: "categoryID",
    });

    if (courses) {
      return res.status(200).json({ data: courses });
    } else {
      return res.status(400).json({ message: "Không tồn tại tài khoản." });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

exports.create = async (req, res) => {
  const { name, shortDesc, content, categoryID, tuition, lecturer } = req.body;
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
      const course = new db.Course(req.body);
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

exports.update = async (req, res) => {
  const { id } = req.params;
  const { shortDesc, content, categoryID, tuition, lecture } = req.body;

  try {
    const course = await db.Course.findById({ _id: id });
    if (course == null) {
      return res.status(404).json({ message: "Not found course" + id });
    } else {
      if (course.name === name) {
        return res.status(400).json({ message: "Name is dupplicate" });
      } else {
        const result = await db.Course.findOneAndUpdate(
          { _id: id },
          {
            name: name || course.name,
            shortDesc: shortDesc || course.shortDesc,
            content: content || course.content,
            categoryID: categoryID || course.categoryID,
          }
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
    let courses = await db.Course.find().select({ _id: 1, name: 1 });
    return res.status(200).json({ data: courses });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.findNewCoures = async (req, res) => {
  try {
    const courses = await db.Course.find({ isNew: true })
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
  const { idCourse } = req.params.id;
  try {
    const course = await db.Course.findById({ _id: idCourse });
    if (course == null) {
      return res.status(404).json({ message: "Not found course " + idCourse });
    }

    const curriculumsByCourseId = course.curriculums;
    // const data = await db.Curriculum.find()
    return res.status(200).json({ data: curriculumsByCourseId });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await db.Curriculum.findById({ _id: id });
    if (data) {
      return res.status(200).json({ data: data });
    } else {
      return res.status(400).json({ message: "Không tồn tại tài khoản." });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};
