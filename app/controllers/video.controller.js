const db = require("../models/index");
const { uploadVideo, uploadFromBuffer } = require("../middlewares/cloudinary");

exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params;

    limit = parseInt(limit);
    offset = parseInt(offset);

    const length = await db.Video.find().countDocuments();

    const data = await db.Video.find()
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
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
};

/**
 * {body: {email, password, displayName}}
 */
exports.upload = (req, res) => {
  console.log(req.file)
  /* Check if there is an image */
  if (!req.file) {
    return res.status(400).json({
      /* Send back a failure message */ 
      message: "Không tìm thấy file",
    });
  } 

  const {path } = req.file;
  // console.log(path)
  uploadVideo(path) /* If there is an image, upload it */
    .then((result) => {
      /* If the upload is successful */
      console.log(result)
      const video = new db.Video({
        url: result.url,
        originalName: result.original_filename,
        resourceType: result.resource_type,
        desc: ""
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
      })
      
    })
    .catch((error) => {
      /* If there is an error uploading the image */
      console.log(error.message);
      return res.status(400).json({
        /* Send back an error response */ 
        message: error.message,
      });
    });
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
    const result = await db.Video.findOneAndDelete({
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
