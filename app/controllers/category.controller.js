const db = require("../models/index");


exports.findAll = async (req, res) => {
  try {

    const data = await db.Category.find();
    return res.status(200).json({ data })
  }
  catch (err) {
    console.log("err: ", err)
    return res.status(500).json({ message: err });
  }
}

exports.findByID = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await db.Category.findById({ _id: id })
    if (category) {
      return res.status(200).json({ data: category })
    }
    else {
      return res.status(400).json({ message: "Không tồn tại thể loại này" })
    }
  }
  catch (err) {
    console.log('err: ', err);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" })
  }
}


/**
 * {body: {email, password, displayName}}
 */
exports.create = async (req, res) => {
  const { name, icon, level, status } = req.body;
  if (!name) {
    return res.status(400).send({
      message: "name not empty."
    })
  }
  try {
    // console.log("BODY",req.body)
    const category = new db.Category(req.body)
    //category.setPasswordHash(password)
    console.log(category);
    const result = await category.save();
    console.log("result: ", result);
    if (result) {
      return res.status(200).json({ message: "Tạo cate thành công.", category: req.body });
    } else {
      return res.status(400).json({ message: "Tạo cate thất bại." });
    }
  } catch {
    return res.status(500).json({ message: "Đã có lỗi xảy ra, vui lòng thử lại." });
  }
}

exports.update = async (req, res) => {
  try {
    db.Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
    ).then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.id,
        });
      }
      res.send(data);
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving documents.",
    });
  }
}

exports.delete = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: "Id không được rỗng" })
  }

  try {
    const result = await db.Category.findOneAndDelete({ _id: id })
    if (result) {
      return res.status(200).json({ message: "Xóa category thành công.", data: result })
    }
    else {
      return res.status(400).json({ message: "Không tìm thấy db.Category." })
    }
  }
  catch (err) {
    console.log('err: ', err)
    return res.status(500).json({ message: "Đã có lỗi xảy ra." })
  }
}

exports.getDropdown = async (req, res) => {
  try {
    let data = await db.Category.find().select({ _id: 1, name: 1 });
    return res.status(200).json({ data: data });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};