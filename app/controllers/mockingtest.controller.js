const db = require("../models/index");

// Retrieving and return all admins to the database
exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const length = await db.MockingTest.find().countDocuments();
    const data = await db.MockingTest.find()
      .limit(limit)
      .skip((offset - 1) * limit)
      .populate("categoryID");

    // const data = assignment.map((item) => {
    //     const { displayName, email } = item;
    //     return { displayName, email };
    // })
    if (data) {
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
