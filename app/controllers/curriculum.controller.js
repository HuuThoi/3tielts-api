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
  const assignment = new db.Curriculum(req.body);
  console.log(req.body);

  assignment.save(async (err, result) => {
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
        message: "Tạo bài tập thành công.",
        data: data,
      });
    } else {
      return res.status(400).json({
        message: "Tạo bài tập thất bại.",
      });
    }
  });
};

exports.update = async (req, res) => {
  console.log(req.body);
  const { _id, name, contents } = req.body;

  if (!_id) {
    return res.status(400).json({
      message: "Id không được rỗng",
    });
  }

  // if (!name && !majorId) {
  //     return res.status(400).json({ message: "Tên tag hoặc ngành học không được rỗng" })
  // }

  try {
    const MockingTest = db.MockingTest;
    const assignment = await MockingTest.findOne({
      _id,
    });

    if (assignment) {
      const result = await MockingTest.findOneAndUpdate(
        {
          _id,
        },
        {
          name: name || assignment.name,
          contents: contents || assignment.contents,
        }
      );
      if (result) {
        const data = await MockingTest.findOne({
          _id: result._id,
        });
        // .populate('majorId')

        if (data) {
          return res.status(200).json({
            message: "Cập nhật bài tập thành công.",
            data,
          });
        }
      }
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

exports.delete = async (req, res) => {
  const { _id } = req.body;
  console.log(req.body);
  if (!_id) {
    return res.status(400).json({
      message: "Id không được rỗng",
    });
  }

  try {
    const MockingTest = db.MockingTest;
    const result = await MockingTest.findOneAndDelete({
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
