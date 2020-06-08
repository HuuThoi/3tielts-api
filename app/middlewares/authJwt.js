const jwt = require("jsonwebtoken");
const config = require("../config/jwt-secret.config");
const db = require("../models/index");
const EUserType = require("../enums/EUserTypes");

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

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
      next();
    });
  });
};

///! warning
//need to test
isAdmin = (req, res, next) => {
  db.User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user.typeID === EUserType.ADMIN) return true;
    return false;
  });
};

isTeacher = (req, res, next) => {
  db.User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user.typeID === EUserType.TEACHER) return true;
    return false;
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isTeacher,
};

module.exports = authJwt;
