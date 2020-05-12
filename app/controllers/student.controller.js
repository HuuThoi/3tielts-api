const db = require("../models/index");

//Get all student
exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params;

    limit = parseInt(limit);
    offset = parseInt(offset);
    const length = await db.Student.find().countDocuments();

    const data = await db.Student.find()
      .limit(limit)
      .skip((offset - 1) * limit)
      .populate({
        path: "userId",
        // match: { isBlock: false },
        select: ["-password", "-passwordHash"],
      });

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