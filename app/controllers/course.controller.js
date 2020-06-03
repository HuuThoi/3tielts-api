const db = require("../models/index");

exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params;

    limit = parseInt(limit);
    offset = parseInt(offset);
    const length = await db.Course.find().countDocuments();

    const data = await db.Course.find()
      .limit(limit)
      .skip((offset - 1) * limit);
    // .populate({
    //   path: 'db.CourseId',
    //   // match: { isBlock: false },
    //   select: ['-password', '-passwordHash'],
    // })

    if (data.length > 0) {
      return res.status(200).json({ data, length });
    } else {
      return res.status(400).json({ message: "Không tìm thấy dữ liệu." });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
};

exports.findByID = async (req, res) => {
  try {
    const { id } = req.params;
    // const category = await Comment.find({_id:id}).populate({path:'CategpryID'})
    const courses = await db.Course.find({ _id: id }).populate({
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

/**
 * {body: {email, password, displayName}}
 */
exports.create = async (req, res) => {
  const {
    name,
    shortDesc,
    content,
    categoryID,
    dateStart,
    dateEnd,
    tuition,
    schedule,
    lecturer,
  } = req.body;
  if (!name || !shortDesc || !content) {
    return res.status(400).send({
      message: "name anf content not empty.",
    });
  }
  try {
    const data = await db.Course.findOne({ name });
    console.log("data: ", data);

    if (data) {
      return res
        .status(400)
        .json({ message: "Khóa học đã tồn tại, nhập khóa học khác" });
    } else {
      console.log("BODY", req.body);
      const course = new db.Course(req.body);
      //db.Course.setPasswordHash(password)
      console.log(course);
      const result = await course.save();
      console.log("result: ", result);
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

/**
 * @param {String} body._id
 * @param {String} body.name
 */

exports.update = async (req, res) => {
  console.log(req.body);
  const {
    _id,
    name,
    shortDesc,
    content,
    categoryID,
    dateStart,
    dateEnd,
    tuition,
    schedule,
    lecture,
  } = req.body;

  if (!_id) {
    return res.status(400).json({ message: "Id không được rỗng" });
  }

  try {
    const course = await db.Course.findOne({ _id });
    const data = await db.Course.findOne({
      $and: [{ name }, { _id: { $ne: _id } }],
    });
    // console.log("data: ", data);
    if (data) {
      return res
        .status(400)
        .json({ message: "Ten khóa học đã tồn tại, nhập khóa học khác" });
    } else {
      if (course) {
        const result = await db.Course.findOneAndUpdate(
          { _id },
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
              .json({ message: "Cập nhật db.Course năng thành công.", data });
          }
        }
      } else {
        return res.status(400).json({ message: "Không tìm thấy db.Course." });
      }
      // if (course) {
      // console.log("LALALAND")}
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};

/**
 * @param {String} body._id
 */

exports.delete = async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(400).json({ message: "Id không được rỗng" });
  }
  try {
    const result = await db.Course.findOneAndDelete({ _id });
    if (result) {
      return res
        .status(200)
        .json({ message: "Xóa db.Course thành công.", data: result });
    } else {
      return res.status(400).json({ message: "Không tìm thấy db.Course." });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};

exports.getDropdown = async (req, res) => {
  try {
    const courses = await db.Class.find();
    return res.status(200).json({ data: courses });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};
