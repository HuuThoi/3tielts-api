const db = require("../models/schedule.model");
const { uploadVideo, uploadFromBuffer } = require("../middlewares/cloudinary");

exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params;

    // console.log("LOG",limit,offset)
    limit = parseInt(limit);
    offset = parseInt(offset);

    const length = await db.Schedule.find().countDocuments();

    const data = await db.Schedule.find()
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
exports.create = async (req, res) => {
  const { day, timeOpen, timeOut, status } = req.body;
  if (!req.file) {
    return res.status(400).json({
      /* Send back a failure message */

      status: "failed",
      message: "No image file was uploaded",
    });
  }

  try {
    /* Check if there is an image */
    const { originalname } = req.file;
    uploadVideo(originalname) /* If there is an image, upload it */
      .then((result) => {
        /* If the upload is successful */
        res.status(201).json({
          /* Send back a success response */

          status: "success",
          imageCloudData: result,
        });
      })
      .catch((error) => {
        /* If there is an error uploading the image */
        console.log(error.message);
        return res.status(400).json({
          /* Send back an error response */

          status: "error",
          message: error.message,
        });
      });
  } catch {
    return res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra, vui lòng thử lại." });
  }
};
