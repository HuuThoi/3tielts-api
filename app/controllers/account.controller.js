const db = require("../models/index");
const Account = db.Account;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var ultil = require("../helpers/user.utils");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).json({
      userId: user._id
    })
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = user.validatePassword(req.body.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      // var token = jwt.sign({ user: user.id }, config.jwtSecret, {
      //   expiresIn: config.jwtExpiresIn
      // });

      var token = ultil.createUserToken(user.id);

      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};