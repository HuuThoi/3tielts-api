const db = require("../models/index");

// Retrieving and return all admins to the database
exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const length = await db.Assignment.find().count();
    const data = await db.Assignment.find()
      .limit(limit)
      .skip((offset - 1) * limit)
      .populate("categoryID");

    // const data = assignment.map((item) => {
    //     const { displayName, email } = item;
    //     return { displayName, email };
    // })
    if (data) {
      return res.status(200).json({ data, length });
    }
    return res.status(400).json({ message: "Không có bài tập nào." });
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send({ message: "Có lỗi xảy ra" });
  }
};

exports.create = async (req, res) => {
  const Assignment = db.Assignment;

  const assignment = new Assignment(req.body);

  assignment.save((err, result) => {
    if (err) {
      console.log("err ", err);
      return res.status(500).json({ message: "Đã có lỗi xảy ra." });
    }
    if (result) {
      // const data = await Assignment.find
      console.log(result);
      return res
        .status(200)
        .json({ message: "Tạo bài tập thành công.", data: result });
    } else {
      return res.status(400).json({ message: "Tạo bài tập thất bại." });
    }
  });
};

exports.update = async (req, res) => {
    console.log(req.body)
    const { _id, name, content } = req.body

    if (!_id) {
        return res.status(400).json({ message: "Id không được rỗng" })
    }

    // if (!name && !majorId) {
    //     return res.status(400).json({ message: "Tên tag hoặc ngành học không được rỗng" })
    // }

    try {
        const Assignment = db.Assignment;
        const assignment = await Assignment.findOne({ _id })

        if (assignment) {

            const result = await Assignment.findOneAndUpdate({ _id }, { name: name || assignment.name, content: content || assignment.content })
            if (result) {
                const data = await Assignment.findOne({ _id: result._id })
                    // .populate('majorId')

                if (data) {
                    return res.status(200).json({ message: "Cập nhật bài tập thành công.", data })
                }
            }
        }
        else {
            return res.status(400).json({ message: "Không tìm thấy bài tập." })
        }
    }
    catch (err) {
        console.log('err: ', err)
        return res.status(500).json({ message: "Đã có lỗi xảy ra." })
    }
}

exports.delete = async (req, res) => {
    const { _id } = req.body
    if (!_id) {
        return res.status(400).json({ message: "Id không được rỗng" })
    }

    try {
        const result = await Assignment.findOneAndDelete({ _id })
        if (result) {
            return res.status(200).json({ message: "Xóa bài tập thành công.", data: result })
        }
        else {
            return res.status(400).json({ message: "Không tìm thấy bài tập." })
        }
    }
    catch (err) {
        console.log('err: ', err)
        return res.status(500).json({ message: "Đã có lỗi xảy ra." })
    }

}