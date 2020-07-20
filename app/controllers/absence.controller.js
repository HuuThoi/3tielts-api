const db = require("../models/index");

// reason: {
// dateFrom: {
// dateTo: {
// studentID: {
// classID: {
// status: Boolean
exports.findAll = async (req, res) => {
  var absences = [];
  try {
    const data = await db.Absence.find()
      .populate({
        path: "classID",
        select: "name"
      }).populate({
        path: "userID",
        select: "username"
      });
    for (let i = 0; i < data.length; i++) {
      let obj = {
        id: data[i]._id,
        reason: data[i].reason,
        dateFrom: data[i].dateFrom,
        dateTo: data[i].dateTo,
        status: data[i].status,
        statusName: data[i].status ? "Đã duyệt" : "Chưa duyệt",
        className: data[i].classID != null ? data[i].classID.name : null,
        studentName: data[i].studentID != null ? data[i].studentID.username : null,
      }
      absences.push(obj);
    }

    return res.status(200).json({ data: absences })
  }
  catch (err) {
    console.log("err: ", err)
    return res.status(500).json({ message: err });
  }
}

exports.findByID = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.Absence.findById({ _id: id })
    if (item) {
      return res.status(200).json({ data: item })
    }
    else {
      return res.status(400).json({ message: "Không tồn tại" })
    }
  }
  catch (err) {
    console.log('err: ', err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" })
  }
}

//is call when user is student
exports.create = async (req, res) => {
  const { reason, dateFrom, dateTo, classID } = req.body;
  try {
    db.Absence.create({
      reason: reason,
      // dateFrom: new Date(dateFrom),
      // dateTo: new Date(dateTo),
      status: false,
      classID: classID,
      userID: req.userData.id
    })
    return res.json("Success");
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};

//role is student
exports.update = async (req, res) => {
  const { reason, dateFrom, dateTo, classID } = req.body;

  try {
    db.Absence.findByIdAndUpdate(req.params.id, {
      $set: {
        reason: reason,
        dateFrom: dateFrom,
        dateTo: dateTo,
        status: false,
        classID: classID,
        userID: req.userData.id
      }
    })
      .then(student => {
        if (!student) {
          return res.status(404).send({
            message: "Student not found with id " + req.params.id
          });
        }
        res.send(student);
      })
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving shifts.",
    });
  }
};

//role is admin
exports.confirmAbsence = async (req, res) => {
  try {
    const item = await db.Absence.findById({ _id: req.params.id });
    if (item == null) {
      return res.status(404).json({ message: "Not found" });
    }
    item.status = !item.status;

    const result = await item.save();
    if (result) {
      return res.status(200).json({ message: "Updated" });
    } else {
      return res.status(400).json({ message: "Fail" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving documents.",
    });
  }
}

exports.delete = async (req, res) => {
  const { id } = req.params

  try {
    const result = await db.Absence.findOneAndDelete({ _id: id })
    if (result) {
      return res.status(200).json({ message: "Xóa Absence thành công." })
    }
    else {
      return res.status(400).json({ message: "Không tìm thấy Absence." })
    }
  }
  catch (err) {
    console.log('err: ', err)
    return res.status(500).json({ message: "Đã có lỗi xảy ra." })
  }
}