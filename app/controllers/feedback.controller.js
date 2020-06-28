const db = require("../models/index");

// content: String,
//     title: String,
//     typeID: Number,
//     rate: Number,
//     anonymous: Boolean,
//     userID
exports.findAll = async (req, res) => {
  var fbs = [];
  try {
    const data = await db.Feedback.find()
      .populate({
        path: "userID",
        select: "displayName"
      });
    for (let i = 0; i < data.length; i++) {
      let obj = {
        id: data[i]._id,
        title: data[i].title,
        typeID: data[i].typeID,
        rate: data[i].rate,
        status: data[i].status,
        user: data[i].userID != null ? data[i].studentID.displayName : null,
      }
      fbs.push(obj);
    }
    return res.status(200).json({ data: fbs })
  }
  catch (err) {
    console.log("err: ", err)
    return res.status(500).json({ message: err });
  }
}

exports.findByID = async (req, res) => {
}

//is call when user is student
exports.create = async (req, res) => {
  const { title, rate } = req.body;
  try {
    db.Feedback.create({
      title: title,
      rate: rate,
      userID: req.userData.id
    })
    return res.json("Success");
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};

exports.update = async (req, res) => {

};

exports.delete = async (req, res) => {
  const { id } = req.params

  try {
    const result = await db.Feedback.findOneAndDelete({ _id: id })
    if (result) {
      return res.status(200).json({ message: "Xóa thành công." })
    }
    else {
      return res.status(400).json({ message: "Không tìm thấy." })
    }
  }
  catch (err) {
    console.log('err: ', err)
    return res.status(500).json({ message: "Đã có lỗi xảy ra." })
  }
}