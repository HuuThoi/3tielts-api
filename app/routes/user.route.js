// const express = require("express");
// const app = express();
// const admins = require("../controllers/admin.controller");

// // Retrieve all admin
// app.get("/", admins.findAll);
// app.post("/create", admins.createAdmin);
// app.post("/login", admins.login);

// app.get("/", async (req, res) => {
//   try {
//     const admin = await Admin.find();
//     const data = admin.map((item) => {
//       const { displayName, email } = item;
//       return { displayName, email };
//     });
//     res.status(200).json({ admin: data });
//   } catch (err) {
//     console.log("err: ", err);
//     res.status(500).send({ message: "Có lỗi xảy ra" });
//   }
// });

// app.get("/", async (req, res) => {
//   try {
//     let { limit, offset } = req.params;

//     limit = parseInt(limit);
//     offset = parseInt(offset);
//     const length = await Student.find().countDocuments();

//     const data = await Student.find()
//       .limit(limit)
//       .skip((offset - 1) * limit)
//       .populate({
//         path: "userId",
//         // match: { isBlock: false },
//         select: ["-password", "-passwordHash"],
//       });

//     if (data.length > 0) {
//       return res.status(200).json({ data, length });
//     } else {
//       return res.status(400).json({ message: "Không tìm thấy dữ liệu." });
//     }
//   } catch (err) {
//     console.log("err: ", err);
//     return res.status(500).json({ message: "Có lỗi xảy ra" });
//   }
// });

// module.exports = app;
