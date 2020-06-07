// const Student = require("../models/student.model");
// const Teacher = require("../models/teacher.model");
const User = require("../models/user.model");
// const EUserTypes = require("../enums/EUserTypes")
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const jwtSecretConfig = require('../../config/jwt-secret.config');
// const userUtils = require('../utils/user.utils');
// const sendEmailUtils = require('../utils/send-email.utils');

// const db = require("../models/index");
// const User=db.User;
exports.findAll = async (req, res) => {
    try {
        let { limit, offset } = req.params

        limit = parseInt(limit)
        offset = parseInt(offset)
        const length = await User.find().countDocuments()

        const data = await User.find()
            .limit(limit)
            .skip((offset - 1) * limit)
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

exports.findByName = async (req, res) => {
    try {
        const { name } = req.params;
        const users = await User.find({ password: name }, { password: 0, passwordHash: 0 })
        if (users) {
            return res.status(200).json({ data: users })
        }
        else {
            return res.status(400).json({ message: "Không tồn tại tài khoản." })
        }
    }
    catch (err) {
        console.log('err: ', err);
        return res.status(500).json({ message: "Đã có lỗi xảy ra" })
    }
};

/**
 * {body: {email, password, displayName}}
 */
exports.register = async (req, res) => {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
        return res.status(400).send({
            message: "email and password not empty."
        })
    }
    try {
        const data = await User.findOne({ email });
        console.log("data: ", data);

        if (data) {
            return res.status(400).json({ message: "Email đã tồn tại, vui lòng nhập email khác." });
        }
        else {
            console.log("BODY", req.body)
            const user = new User(req.body)

            user.setPasswordHash(password)

            console.log(user);
            const result = await user.save();
            // try {
            //     const result = await user.save();
            //   }
            //   catch(err) {
            //     console.log(err.message);
            //   }

            console.log("result: ", result);
            if (result) {
                return res.status(200).json({ message: "Tạo tài khoản thành công.", user: result });
            } else {
                return res.status(400).json({ message: "Tạo tài khoản thất bại." });
            }
        }
    } catch {
        return res.status(500).json({ message: "Đã có lỗi xảy ra, vui lòng thử lại." });
    }
}

exports.update = async (req, res) => {
    console.log(req.body)
    const { _id, displayName } = req.body

    if (!_id) {
        return res.status(400).json({ message: "Id không được rỗng" })
    }

    if (!displayName) {
        return res.status(400).json({ message: "Tên tag hoặc ngành học không được rỗng" })
    }

    try {
        const user = await User.findOne({ _id })
        if (user) {
            const result = await User.findOneAndUpdate({ _id }, { displayName: displayName || user.displayName })
            if (result) {
                const data = await User.findOne({ _id: result._id })

                if (data) {
                    return res.status(200).json({ message: "Cập nhật user năng thành công.", data })
                }
            }
        }
        else {
            return res.status(400).json({ message: "Không tìm thấy user." })
        }
    }
    catch (err) {
        console.log('err: ', err)
        return res.status(500).json({ message: "Đã có lỗi xảy ra." })
    }
}

exports.delete = async (req, res) => {
    const { _id } = req.body
    if (!_id) {
        return res.status(400).json({ message: "Id không được rỗng" })
    }
    try {
        const result = await User.findOneAndDelete({ _id })
        if (result) {
            return res.status(200).json({ message: "Xóa user thành công.", data: result })
        }
        else {
            return res.status(400).json({ message: "Không tìm thấy user." })
        }
    }
    catch (err) {
        console.log('err: ', err)
        return res.status(500).json({ message: "Đã có lỗi xảy ra." })
    }

}


