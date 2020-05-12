const db = require("../models/index");


exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params

    limit = parseInt(limit)
    offset = parseInt(offset)
    const length = await db.Comment.find().countDocuments()

    const data = await db.Comment.find()
      .limit(limit)
      .skip((offset - 1)*limit)
      // .populate({
      //   path: 'userId',
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

exports.findByID= async (req, res) => {
  try {
    const {id} = req.params;
    const category = await db.Comment.find({_id:id}).populate({path:'authorID'})
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
  const {title,content,datePosted,like, } = req.body;
  if (!title || !content ) {
    return res.status(400).send({
      message: "title and content not empty."
    })
  }
  try {
    // console.log("BODY",req.body)
      const comment = new db.Comment(req.body)
      //db.Comment.setPasswordHash(password)
       console.log(comment);
      const result = await comment.save();
      console.log("result: ", result);
      if (result) {
        return res.status(200).json({ message: "Tạo cate thành công.", comment: req.body });
      } else {
        return res.status(400).json({ message: "Tạo cate thất bại." });
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
  // console.log(req.body)
  const {title,content,datePosted,like, } = req.body;
  if (!_id) {
      return res.status(400).json({ message: "Id không được rỗng" })
  }
  if (!name) {
      return res.status(400).json({ message: "Tên tag hoặc ngành học không được rỗng" })
  }
  try {
      const category = await db.Comment.findOne({ _id })
      if(category) {
          const result = await db.Comment.findOneAndUpdate({ _id }, 
                                                        { title: title || comment.title,
                                                          content: content || comment.content,
                                                          datePosted: datePosted || comment.datePosted,
                                                          like: status })
          if (result) {
              const data = await db.Comment.findOne({ _id: result._id })
              if (data) {
                  return res.status(200).json({ message: "Cập nhật category năng thành công.", data })
              }
          }
      }
      else {
          return res.status(400).json({ message: "Không tìm thấy db.Comment." })
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
      const result = await db.Comment.findOneAndDelete({ _id })
      if (result) {
          return res.status(200).json({ message: "Xóa category thành công.", data: result })
      }
      else {
          return res.status(400).json({ message: "Không tìm thấy db.Comment." })
      }
  }
  catch (err) {
      console.log('err: ', err)
      return res.status(500).json({ message: "Đã có lỗi xảy ra." })
  }
}