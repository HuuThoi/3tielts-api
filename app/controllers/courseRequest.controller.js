const db = require("../models/index");
const EUserTypes = require("../enums/EUserTypes");


exports.findAll = async (req, res) => {
  const c = await db.Request.find();
  if (c != null && c.length > 0) {
    for (let i = 0; i < c.length; i++) {
      if (c[i].createdAt !== null && c[i].createdAt != undefined) {
        if (((new Date().getTime() - c[i].createdAt.getTime()) / (60000 * 60 * 24)) > 7) {
          let item = await db.Request.findById({ _id: c[i]._id });
          item.status = "Canceled";
          await item.save();
        }
      }
    }
  }
  try {
    const courseRequests = await db.Request.find().populate({
      path: "userID"
    }).populate({
      path: "courseID"
    })

    var data = [];
    for (let i = 0; i < courseRequests.length; i++) {
      let x = {
        id: courseRequests[i]._id,
        studentName: courseRequests[i].userID ? courseRequests[i].userID.username : null,
        courseName: courseRequests[i].courseID ? courseRequests[i].courseID.name : null,
        status: courseRequests[i].status
      }
      data.push(x);
    }

    return res.status(200).json({ data: data })
  }
  catch (err) {
    console.log("err: ", err)
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
}

exports.update = async (req, res) => {
  const { status, id } = req.body;
  try {
    const item = await db.Request.findById({ _id: id })
    if (item) {
      const result = await db.Request.findOneAndUpdate({ _id: id },
        {
          status: status
        })
      if (result) {
        const course = await db.Course.findById({ _id: result.courseID });

        if (course.studentList.length > 0) {
          const found = course.studentList.find(x => x === item.userID);
          if (found === null || found === undefined) {
            course.studentList.push(item.userID);
            await course.save();
          }
        } else {
          course.studentList.push(item.userID);
          await course.save();
        }

        db.User.findByIdAndUpdate({ _id: item.userID, role: EUserTypes.STANDARD }, {
          $set: {
            role: EUserTypes.STUDENT,
          }
        })

        //add to studentCourseDiligence

        var listDateLearning = [];
        for (let i = 0; i < 7; i++) { //7 in in week(Sunday -> Saturday: 0->6)
          listDateLearning.push(false);
        }

        var object = {
          userId: item.userID,
          courseId: item.courseID,
          listDateLearning: listDateLearning
        }

        const x = new db.StudentCourseDiligence(object);
        const result = await x.save();
        if (result) {
        } else {
          return res.status(400).json({ message: "Tạo diligence thất bại." });
        }

        const data = await db.Request.findById({ _id: result._id })
        if (data) {
          return res.status(200).json({ message: "Cập nhật thành công.", data })
        }
      }
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