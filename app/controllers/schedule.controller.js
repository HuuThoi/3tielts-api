const Schedule = require("../models/schedule.model");


exports.findAll = async (req, res) => {
  try {
    let { limit, offset } = req.params

    // console.log("LOG",limit,offset)
    limit = parseInt(limit)
    offset = parseInt(offset)

    const length = await Schedule.find().countDocuments()

    const data = await Schedule.find()
      .limit(limit)
      .skip((offset - 1) * limit)
    // .populate({
    //   path: 'CourseId',
    //   // match: { isBlock: false },
    //   select: ['-password', '-passwordHash'],
    // })

    console.log("data",data)

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


exports.findByID = async (req, res) => {
  try {
    const {id} = req.params;
    // const category = await Comment.find({_id:id}).populate({path:'CategpryID'})
    const schedule = await Schedule.find({_id:id})
    if (schedule) {
      return res.status(200).json({ data: schedule })
    }
    else {
      return res.status(400).json({ message: "Không tồn tại TKB" })
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
  const { day, timeOpen, timeOut,status } = req.body;
  if (!day || !timeOpen || !timeOut || !status) {
    return res.status(400).send({
      message: "The content not empty."
    })
  }
  try {
      console.log("BODY", req.body)
      const schedule = new Schedule(req.body)
      //Course.setPasswordHash(password)
      console.log(schedule);
      const result = await schedule.save();
      console.log("result: ", result);
      if (result) {
        return res.status(200).json({ message: "Tạo khóa học thành công.", Schedule: req.body });
      } else {
        return res.status(400).json({ message: "Tạo khóa học thất bại." });
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
  const { _id, day, timeOpen, timeOut,status } = req.body

  if (!_id) {
    return res.status(400).json({ message: "Id không được rỗng" })
  }


  try {

    const schedule = await Schedule.findOne({ _id })

      if (schedule) {
        const result = await Schedule.findOneAndUpdate({ _id },
                                                      {
                                                        day: day || schedule.day,
                                                        timeOpen: timeOpen || schedule.timeOpen,
                                                        timeOut: timeOut || schedule.timeOut,
                                                        status: status || schedule.status                                                      })
        if (result) {
          const data = await Schedule.findOne({ _id: result._id })


          if (data) {
            return res.status(200).json({ message: "Cập nhật TKB năng thành công.", data })
          }
        }
      }
      else {
        return res.status(400).json({ message: "Không tìm thấy TKB." })
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
    const result = await Schedule.findOneAndDelete({ _id })
    if (result) {
      return res.status(200).json({ message: "Xóa TKB thành công.", data: result })
    }
    else {
      return res.status(400).json({ message: "Không tìm thấy TKB." })
    }
  }
  catch (err) {
    console.log('err: ', err)
    return res.status(500).json({ message: "Đã có lỗi xảy ra." })
  }

}

