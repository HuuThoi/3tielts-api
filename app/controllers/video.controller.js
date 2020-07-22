const db = require("../models/index");
var convert = require("convert-seconds");
const EUserTypes = require("../enums/EUserTypes");

const { uploadVideo, uploadFromBuffer } = require("../middlewares/cloudinary");

exports.findAll = async (req, res) => {
  try {
    const userData = req.userData;

    let { limit, offset } = req.params;

    limit = parseInt(limit);
    offset = parseInt(offset);

    if (userData.role == EUserTypes.ADMIN) {
      const length = await db.Upload.find().countDocuments();

      const data = await db.Upload.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((offset - 1) * limit);
      // .populate({
      //   path: 'CourseId',
      //   // match: { isBlock: false },
      //   select: ['-password', '-passwordHash'],
      // })

      console.log("data", data);

      if (data.length > 0) {
        return res.status(200).json({ data, length });
      } else {
        return res.status(400).json({ message: "Không tìm thấy dữ liệu." });
      }
    } else if (userData.role == EUserTypes.TEACHER) {
      const length = await db.Upload.find({
        teacherID: userData.id,
      }).countDocuments();

      const data = await db.Upload.find({ teacherID: userData.id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((offset - 1) * limit);
      // .populate({
      //   path: 'CourseId',
      //   // match: { isBlock: false },
      //   select: ['-password', '-passwordHash'],
      // })

      if (data.length > 0) {
        return res.status(200).json({ data, length });
      } else {
        return res.status(400).json({ message: "Không tìm thấy dữ liệu." });
      }
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
};
exports.find = async (req, res) => {
  const userData = req.userData;
  try {
    if (userData.role == EUserTypes.ADMIN) {
      const dataVideo = await db.Upload.find({ resourceType: "video" }).sort({
        createdAt: -1,
      });
      const dataDoc = await db.Upload.find({
        resourceType: "application/pdf",
      }).sort({ createdAt: -1 });
   

      console.log("data", dataDoc);

      if (dataVideo.length > 0) {
        return res.status(200).json({ dataVideo, dataDoc });
      } else {
        return res.status(400).json({ message: "Không tìm thấy dữ liệu." });
      }
    }
    else if (userData.role == EUserTypes.TEACHER) {
      const dataVideo = await db.Upload.find({ $and: [{ resourceType: "video" },{ teacherID: userData.id }]}).sort({
        createdAt: -1,
      });
      const dataDoc = await db.Upload.find({
        resourceType: "application/pdf",
      }).sort({ createdAt: -1 });
   

      console.log("data", dataDoc);

      if (dataVideo.length > 0) {
        return res.status(200).json({ dataVideo, dataDoc });
      } else {
        return res.status(400).json({ message: "Không tìm thấy dữ liệu." });
      }
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
};

/**
 * {body: {email, password, displayName}}
 */
exports.upload = (req, res) => {
  console.log(req.file);
  const userData = req.userData;
  /* Check if there is an image */
  if (!req.file) {
    return res.status(400).json({
      /* Send back a failure message */

      message: "Không tìm thấy file",
    });
  }

  const { path, mimetype } = req.file;
  if (mimetype === "application/pdf") {
    const { filename } = req.file;
    const pdf = new db.Upload({
      url: path,
      originalName: filename,
      resourceType: mimetype,
      desc: "",
      teacherID: userData.id,
    });
    pdf.save((err, result) => {
      if (err) {
        console.log("err ", err);
        return res.status(500).json({
          message: "Đã có lỗi xảy ra (upload thành công).",
        });
      }
      if (result) {
        // const data = await Assignment.find
        console.log(result);
        return res.status(200).json({
          message: "Upload thành công.",
          data: result,
        });
      }
    });
  } else {
    // console.log(path)
    uploadVideo(path) /* If there is an image, upload it */
      .then((result) => {
        /* If the upload is successful */
        console.log(result);
        const { duration } = result;
        const length =
          convert(duration).hours +
          "h" +
          convert(duration).minutes +
          "min" +
          convert(duration).seconds +
          "s";

        duration;
        const video = new db.Upload({
          url: result.url,
          originalName: result.original_filename,
          resourceType: result.resource_type,
          desc: "",
          duration: length,
          teacherID: userData.id,
        });
        video.save((err, result) => {
          if (err) {
            console.log("err ", err);
            return res.status(500).json({
              message: "Đã có lỗi xảy ra (upload thành công).",
            });
          }
          if (result) {
            // const data = await Assignment.find
            console.log(result);
            return res.status(200).json({
              message: "Upload thành công.",
              data: result,
            });
          }
        });
      })
      .catch((error) => {
        /* If there is an error uploading the image */
        console.log(error.message);
        return res.status(400).json({
          /* Send back an error response */

          message: error.message,
        });
      });
  }
};

exports.delete = async (req, res) => {
  const { _id } = req.body;
  console.log(req.body);
  if (!_id) {
    return res.status(400).json({
      message: "Id không được rỗng",
    });
  }

  try {
    const result = await db.Upload.findOneAndDelete({
      _id,
    });
    if (result) {
      return res.status(200).json({
        message: "Xóa file thành công.",
        data: result,
      });
    } else {
      return res.status(400).json({
        message: "Không tìm thấy file.",
      });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({
      message: "Đã có lỗi xảy ra.",
    });
  }
};
