const db = require("../models/index");


exports.findAll = async (req, res) => {
  try {
  
    const length = await db.Category.find().countDocuments()
    const data = await db.Category.find()
      // .populate({
      //   path: 'userId',
      //   // match: { isBlock: false },
      //   select: ['-password', '-passwordHash'],
      // })

      return res.status(200).json({ data, length })
  }
  catch (err) {
    console.log("err: ", err)
    return res.status(500).json({ message: err });
  }
}

exports.findByID= async (req, res) => {
  try {
    const {id} = req.params;
    const category = await db.Category.find({_id:id})
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
  const { name,icon,level,status } = req.body;
  if (!name ) {
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



/**
 * @param {String} body._id
 * @param {String} body.name
 */

exports.update = async (req, res) => {
  console.log(req.body)
  const { _id, name, icon, level, status} = req.body

  if (!_id) {
      return res.status(400).json({ message: "Id không được rỗng" })
  }

  if (!name) {
      return res.status(400).json({ message: "Tên tag hoặc ngành học không được rỗng" })
  }

  try {
      const category = await db.Category.findOne({ _id })

      if(category) {
          const result = await db.Category.findOneAndUpdate({ _id }, 
                                                        { name: name || category.name,
                                                          icon: icon || category.icon,
                                                          level: level || category.level,
                                                          status: status || category.status })
          if (result) {
              const data = await db.Category.findOne({ _id: result._id })
              if (data) {
                  return res.status(200).json({ message: "Cập nhật category năng thành công.", data })
              }
          }
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

/**
* @param {String} body._id
*/

exports.delete = async (req, res) => {
  const { _id } = req.body
  if (!_id) {
      return res.status(400).json({ message: "Id không được rỗng" })
  }

  try {
      const result = await db.Category.findOneAndDelete({ _id })
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