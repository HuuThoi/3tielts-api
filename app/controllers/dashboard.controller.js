const db = require("../models/index");
const EUserTypes = require("../enums/EUserTypes");
const { count } = require("../models/user.model");

exports.getBasicInfoForAdmin = async (req, res) => {
  try {
    //users
    const users = await db.User.find();
    console.log(users);

    let countStu = 0;
    let countAdm = 0;
    let countTea = 0;
    let countSta = 0;
    for (let i = 0; i < users.length; i++) {
      if (users[i].role === EUserTypes.STUDENT) {
        countStu = +countStu + 1;
      } else if (users[i].role === EUserTypes.ADMIN) {
        countAdm = +countAdm + 1;
      } else if (users[i].role === EUserTypes.TEACHER) {
        countTea = +countTea + 1;
      } else {
        countSta = +countSta + 1;
      }
    }

    //courses

    let courses = await db.Course.find({ isConfirmed: true });
    let countCou = courses.length;

    //documents
    let documents = await db.Document.find();
    let countDoc = documents.length;

    //mocktests
    let mocktests = await db.MockingTest.find();
    let countMoc = mocktests.length;


    //videos
    let videos = await db.Upload.find({ resourceType: "video" });
    let countVid = videos.length;

    const data = {
      students: countStu,
      teachers: countTea,
      admins: countAdm,
      standards: countSta,
      courses: countCou,
      videos: countVid,
      documents: countDoc,
      mocktests: countMoc
    }

    return res.json({ data: data });

  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.getBasicInfoForTeacher = async (req, res) => {
  try {
    //courses
    let courses = await db.Course.find({ isConfirmed: true, lecturer: req.userData.id });
    let countCou = courses.length;

    //documents
    let documents = await db.Document.find({ authorID: req.userData.id });
    let countDoc = documents ? documents.length : 0;

    //videos
    var courseIds = courses.map(x => {
      return x._id;
    })

    //temp: update soon
    let videos = await db.Upload.find({ resourceType: "video" });
    let countVid = videos.length;

    const data = {
      courses: countCou,
      documents: countDoc,
      videos: countVid
    }

    return res.json({ data: data });

  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};

exports.getBasicInfoForStudent = async (req, res) => {
  try {
    //courses

    let courses = await db.Course.find({ isConfirmed: true, studentList: { $in: req.userData.id } })
    let countCou = courses.length;

    const data = {
      courses: countCou
    }

    return res.json({ data: data });

  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err });
  }
};