const jwt = require("jsonwebtoken");
const config = require("../config/jwt-secret.config");
const db = require("../models/index");
const EUserType = require("../enums/EUserTypes");

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
console.log(token)
if (!token) {
    return res.status(403).send({ message: "Forbidden!" });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    db.User.findOne({ _id: decoded.id }, function (err, user) {
      if (err) return handleError(err);
      userData = {
        id: decoded.id,
        role: user.role
      }
      req.userData = userData;
      console.log(userData)
      next();
    });
  });
};

///! warning
//need to test
isAdmin = (req, res, next) => {
  db.User.findById(req.userData.id).exec((err, user) => {
    if (err || user.role != EUserType.ADMIN) {
      return res.status(403).send({ message: "Forbidden!" });
    }
    req.isAdmin = true;
    next();
  });
};

isTeacher = (req, res, next) => {
  db.User.findById(req.userData.id).exec((err, user) => {
    if (err || user.role != EUserType.TEACHER) {
      return res.status(403).send({ message: "Forbidden!" });
    }
    req.isTeacher = true;
    next();
  });
};

isStudent = (req, res, next) => {
  db.User.findById(req.userData.id).exec((err, user) => {
    if (err || user.role != EUserType.STUDENT) {
      return res.status(403).send({ message: "Forbidden!" });
    }
    req.isStudent = true;
    next();
  });
};

isManagePermission = (req, res, next) => {
  db.User.findById(req.userData.id).exec((err, user) => {
    if (err ) {
      return res.status(403).send({ message: "Forbidden!" });
    }
    if(user.role != EUserType.ADMIN && user.role != EUserType.TEACHER){
      return res.status(403).send({ message: "Forbidden!" });
    }else{
      req.isManagePermission = true;
      next();
    }
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isTeacher,
  isStudent,
  isManagePermission
};

module.exports = authJwt;
