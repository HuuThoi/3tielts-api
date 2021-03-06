const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
// const Class = require("../models/class.model");
const EUserTypes = require("../enums/EUserTypes")
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSecretConfig = require('../../config/jwt-secret.config');
const userUtils = require('../utils/user.utils');
const sendEmailUtils = require('../utils/send-email.utils');


exports.findAll = async (req, res) => {
  try {

    const users = await User.find();

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
}

/**
 * User register
 * @param {String} body._id 
 * _id is id of User not _id of Student or Teacher
 */
exports.getInforUser = async (req, res) => {
  const { _id } = req.params

  try {

    const user = await User.findOne({ _id })

    if (user) {
      const { typeID } = user
      if (parseInt(typeID) === EUserTypes.TEACHER) {
        const data = await Teacher.findOne({ userId: _id })
          .populate({
            path: 'userId',
            select: ['-password', '-passwordHash'],
            populate: [{ path: 'district' }, {path: 'city'}],
          })
          .populate('tags._id')

        if (data) {
          return res.status(200).json({ data })
        }

        return res.status(400).json({ message: "Tài khoản không tồn tại." });
      }
      else {
        const data = await Student.findOne({ userId: _id })
          .populate({
            path: 'userId',
            select: ['-password', '-passwordHash'],
            populate: [{ path: 'district' }, {path: 'city'}],
          })
        return res.status(200).json({ data })
      }
    }
    else {
      return res.status(400).json({ message: "Không tìm thấy tài khoản người dùng" })
    }
  }
  catch (err) {
    console.log("err: ", err)
    return res.status(500).json({ message: "Đã có lỗi xảy ra" })
  }

}

exports.register = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'Email hoặc mật khẩu trống.'
    });
  }
  User.findOne({ email: req.body.email }, (err, data) => {
    if (err) {
      return res
        .status(500)
        .send({ message: 'Đã có lỗi xảy ra, vui lòng thử lại!' });
    }
    if (data) {
      return res
        .status(400)
        .send({ message: 'Email đã tồn tại, vui lòng nhập email khác.' });
    }

    const user = new User(req.body);
    user.setPasswordHash(req.body.password);
    user.avatar =
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_960_720.png';
    user
      .save()
      .then(userData => {
        // send active email
        const token = userUtils.createActiveEmailTokenWithId(userData._id);
        sendEmailUtils.sendVerificationEmail(
          userData.displayName,
          userData.email,
          token
        );
        if (userData.typeID === EUserTypes.TEACHER) {
          const teacher = new Teacher();
          teacher.userId = userData._id;
          teacher
            .save()
            .then(teacherData => {
              res.status(200).send({ user: userData });
            })
            .catch(err => {
              console.log('error: ', err.message);
              return res
                .status(500)
                .send({ message: 'Đã có lỗi xảy ra, vui lòng thử lại' });
            });
        } else {
          const student = new Student();
          student.userId = userData._id;
          student
            .save()
            .then(studentData => {
              res.status(200).send({ user: userData });
            })
            .catch(err => {
              console.log('error: ', err.message);
              return res
                .status(500)
                .send({ message: 'Đã có lỗi xảy ra, vui lòng thử lại' });
            });
        }
      })
      .catch(err => {
        console.log('error: ', err.message);
        return res
          .status(500)
          .send({ message: 'Đã có lỗi xảy ra, vui lòng thử lại' });
      });
  });
};

// login with email and password
exports.login = (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log('error', err.message);
      return res.status(400).json({
        status: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }
    if (user.typeID !== req.body.typeID) {
      return res.status(400).json({
        status: false,
        message: 'Tài khoản không hợp lệ'
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
        });
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const {
        _doc: { passwordHash, password, ...userInfo },
        ...otherInfo
      } = user;
      const token = jwt.sign({ ...userInfo }, jwtSecretConfig.jwtSecret);
      console.log('other info: ', userInfo);
      return res.status(200).json({ user: { token, ...userInfo } });
    });
  })(req, res);
};
