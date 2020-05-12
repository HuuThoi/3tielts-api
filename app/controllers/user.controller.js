// const db = require("../models/index");

// exports.findAll = async (req, res) => {
//   try {
//     let { limit, offset } = req.params

//     limit = parseInt(limit)
//     offset = parseInt(offset)
//     const length = await db.User.find().countDocuments()

//     const data = await db.User.find()
//       .limit(limit)
//       .skip((offset - 1) * limit)
//     // .populate({
//     //   path: 'userId',
//     //   // match: { isBlock: false },
//     //   select: ['-password', '-passwordHash'],
//     // })

//     if (data.length > 0) {
//       return res.status(200).json({ data, length })
//     }
//     else {
//       return res.status(400).json({ message: "Không tìm thấy dữ liệu." })
//     }
//   }
//   catch (err) {
//     console.log("err: ", err)
//     return res.status(500).json({ message: "Có lỗi xảy ra" });
//   }
// }

// exports.findByName = async (req, res) => {
//   try {
//     const { name } = req.params;
//     const users = await db.User.find({ password: name }, { password: 0, passwordHash: 0 })
//     if (users) {
//       return res.status(200).json({ data: users })
//     }
//     else {
//       return res.status(400).json({ message: "Không tồn tại tài khoản." })
//     }
//   }
//   catch (err) {
//     console.log('err: ', err);
//     return res.status(500).json({ message: "Đã có lỗi xảy ra" })
//   }
// }

// /**
//  * {body: {email, password, displayName}}
//  */
// exports.register = async (req, res) => {
//   const { email, password, displayName } = req.body;
//   if (!email || !password) {
//     return res.status(400).send({
//       message: "email and password not empty."
//     })
//   }
//   try {
//     const data = await db.User.findOne({ email });
//     console.log("data: ", data);

//     if (data) {
//       return res.status(400).json({ message: "Email đã tồn tại, vui lòng nhập email khác." });
//     }
//     else {
//       console.log("BODY", req.body)
//       const user = new db.User(req.body)
//       user.setPasswordHash(password)
//       console.log(user);
//       const result = await user.save();
//       console.log("result: ", result);
//       if (result) {
//         return res.status(200).json({ message: "Tạo tài khoản thành công.", user: req.body });
//       } else {
//         return res.status(400).json({ message: "Tạo tài khoản thất bại." });
//       }
//     }
//   } catch {
//     return res.status(500).json({ message: "Đã có lỗi xảy ra, vui lòng thử lại." });
//   }
// }

// /**
//  * @param {String} body._id
//  * @param {String} body.name
//  */

// exports.update = async (req, res) => {
//   console.log(req.body)
//   const { _id, displayName } = req.body

//   if (!_id) {
//     return res.status(400).json({ message: "Id không được rỗng" })
//   }

//   if (!displayName) {
//     return res.status(400).json({ message: "Tên tag hoặc ngành học không được rỗng" })
//   }

//   try {
//     const user = await db.User.findOne({ _id })
//     if (user) {
//       const result = await db.User.findOneAndUpdate({ _id }, { displayName: displayName || user.displayName })
//       if (result) {
//         const data = await db.User.findOne({ _id: result._id })
//         if (data) {
//           return res.status(200).json({ message: "Cập nhật user năng thành công.", data })
//         }
//       }
//     }
//     else {
//       return res.status(400).json({ message: "Không tìm thấy user." })
//     }
//   }
//   catch (err) {
//     console.log('err: ', err)
//     return res.status(500).json({ message: "Đã có lỗi xảy ra." })
//   }
// }

// /**
// * @param {String} body._id
// */

// exports.delete = async (req, res) => {
//   const { _id } = req.body
//   if (!_id) {
//     return res.status(400).json({ message: "Id không được rỗng" })
//   }

//   try {
//     const result = await db.User.findOneAndDelete({ _id })
//     if (result) {
//       return res.status(200).json({ message: "Xóa user thành công.", data: result })
//     }
//     else {
//       return res.status(400).json({ message: "Không tìm thấy user." })
//     }
//   }
//   catch (err) {
//     console.log('err: ', err)
//     return res.status(500).json({ message: "Đã có lỗi xảy ra." })
//   }
// }