const db = require("../models/index");

// Retrieving and return all admins to the database
exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const length = await db.Curriculum.find().countDocuments();
    const data = await db.Curriculum.find()
      .limit(limit)
      .skip((offset - 1) * limit)
      .sort({createdAt: -1})
      .populate("courseID")
      .populate("linkHomework")
      .populate("linkVideo")
      .populate("linkDoc");


    // const data = assignment.map((item) => {
    //     const { displayName, email } = item;
    //     return { displayName, email };
    // })
    if (data) {
        console.log(data)
      return res.status(200).json({
        data,
        length,
      });
    }
    return res.status(400).json({
      message: "Không có bài tập nào.",
    });
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send({
      message: "Có lỗi xảy ra",
    });
  }
};

exports.create = (req, res) => {
  const curriculum = new db.Curriculum(req.body);
  console.log(req.body);

  curriculum.save(async (err, result) => {
    if (err) {
      console.log("err ", err);
      return res.status(500).json({
        message: "Đã có lỗi xảy ra.",
      });
    }
    if (result) {
      // const data = await Assignment.find
      const course = await db.Course.findById({ _id: result.courseID });

      if (course.curriculums.length > 0) {
        const found = course.curriculums.find((x) => x === result._id);
        if (found === null || found === undefined) {
          course.curriculums.push(result._id);
          await course.save();
        }
      } else {
        course.curriculums.push(result._id);
        await course.save();
      }

      const data = await db.Curriculum.findById({ _id: result._id })
      .populate("courseID")
      .populate("linkHomework")
      .populate("linkVideo")
      .populate("linkDoc");
      
      console.log(data)

      return res.status(200).json({
        message: "Tạo bài học thành công.",
        data: data,
      });
    } else {
      return res.status(400).json({
        message: "Tạo bài học thất bại.",
      });
    }
  });
};

exports.update = async (req, res) => {
  console.log(req.body);
  const { _id, name, linkVideo, linkDoc, courseID, linkHomework } = req.body;

  if (!_id) {
    return res.status(400).json({
      message: "Id không được rỗng",
    });
  }

  // if (!name && !majorId) {
  //     return res.status(400).json({ message: "Tên tag hoặc ngành học không được rỗng" })
  // }

  try {
    const Curriculum = db.Curriculum;
    const curriculum = await Curriculum.findOne({
      _id,
    });

    if (curriculum) {
      const result = await Curriculum.findOneAndUpdate(
        {
          _id,
        },
        {
          name: name || curriculum.name,
          linkVideo: linkVideo || curriculum.linkVideo,
          linkDoc: linkDoc || curriculum.linkDoc,
          courseID: courseID || curriculum.courseID,
          linkHomework: linkHomework || curriculum.linkHomework
        }
      );
      if (result) {
        const data = await Curriculum.findOne({
          _id: result._id,
        }).populate("courseID")
        .populate("linkHomework")
        .populate("linkVideo")
        .populate("linkDoc");
        ;
        // .populate('majorId')

        if (data) {
          return res.status(200).json({
            message: "Cập nhật bài học thành công.",
            data,
          });
        }
      }
    } else {
      return res.status(400).json({
        message: "Không tìm thấy bài học.",
      });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({
      message: "Đã có lỗi xảy ra.",
    });
  }
};

exports.delete = async (req, res) => {
  const { _id } = req.body;
  console.log(req.body);
  if (!_id) {
    return res.status(400).json({
      message: "Id không được rỗng",
    });
  }

  try {
    const result = await db.Curriculum.findOneAndDelete({
      _id,
    });
    if (result) {
      return res.status(200).json({
        message: "Xóa bài tập thành công.",
        data: result,
      });
    } else {
      return res.status(400).json({
        message: "Không tìm thấy bài tập.",
      });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({
      message: "Đã có lỗi xảy ra.",
    });
  }
};
