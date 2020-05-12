const db = require("../models/index");

exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params

    limit = parseInt(limit)
    offset = parseInt(offset)
    const length = await db.Question.find().countDocuments()

    const data = await db.Question.find()
      .limit(limit)
      .skip((offset - 1)*limit)
      // .populate({
      //   path: 'documentId',
      //   // match: { isBlock: false },
      //   select: ['-password', '-passwordHash'],
      // })

    if (data.length > 0) {
      return res.status(200).json({ data, length })
    }
    else {
      return res.status(400).json({ message: "Không tìm thấy dữ liệu." })
    }


  }
  catch (err) {
    console.log("err: ", err)
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
}

exports.findByName = async (req, res) => {
  try {
    const {name} = req.params;
    const documents = await db.Question.find({password:name}, { password: 0, passwordHash: 0 })
    if (documents) {
      return res.status(200).json({ data: documents })
    }
    else {
      return res.status(400).json({ message: "Không tồn tại tài khoản." })
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
  const { email, password, displayName } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      message: "email and password not empty."
    })
  }
  try {
    const data = await db.Question.findOne({ email });
    console.log("data: ", data);

    if (data) {
      return res.status(400).json({ message: "Email đã tồn tại, vui lòng nhập email khác." });
    }
    else {
      console.log("BODY",req.body)
      const document = new db.Question(req.body)
      //document.setPasswordHash(password)
       console.log(document);
      const result = await document.save();
      console.log("result: ", result);
      if (result) {
        return res.status(200).json({ message: "Tạo tài khoản thành công.", document: req.body });
      } else {
        return res.status(400).json({ message: "Tạo tài khoản thất bại." });
      }
    }
  } catch {
    return res.status(500).json({ message: "Đã có lỗi xảy ra, vui lòng thử lại." });
  }
}

/**
 * @param {String} body._id
 * @param {String} body.name
 */

exports.update = async (req, res) => {
  console.log(req.body)
  const { _id, displayName} = req.body

  if (!_id) {
      return res.status(400).json({ message: "Id không được rỗng" })
  }

  if (!displayName ) {
      return res.status(400).json({ message: "Tên tag hoặc ngành học không được rỗng" })
  }
  try {
      const document = await db.Question.findOne({ _id })
      if (document) {
          const result = await db.Question.findOneAndUpdate({ _id }, { displayName: displayName || document.displayName})
          if (result) {
              const data = await db.Question.findOne({ _id: result._id })
              if (data) {
                  return res.status(200).json({ message: "Cập nhật document năng thành công.", data })
              }
          }
      }
      else {
          return res.status(400).json({ message: "Không tìm thấy document." })
      }
  }
  catch (err) {
      console.log('err: ', err)
      return res.status(500).json({ message: "Đã có lỗi xảy ra." })
  }
}

/**
* @param {String} body._id
*/

exports.delete = async (req, res) => {
  const { _id } = req.body
  if (!_id) {
      return res.status(400).json({ message: "Id không được rỗng" })
  }

  try {
      const result = await db.Question.findOneAndDelete({ _id })
      if (result) {
          return res.status(200).json({ message: "Xóa document thành công.", data: result })
      }
      else {
          return res.status(400).json({ message: "Không tìm thấy document." })
      }
  }
  catch (err) {
      console.log('err: ', err)
      return res.status(500).json({ message: "Đã có lỗi xảy ra." })
  }
}