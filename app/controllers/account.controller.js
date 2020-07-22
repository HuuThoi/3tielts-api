const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ultil = require("../helpers/user.utils");
const nodemailer = require("nodemailer");
const config = require("../config/jwt-secret.config");
var smtpTransport = require("nodemailer-smtp-transport");

exports.signup = (req, res) => {
  var userx = db.User.findOne({ email: req.body.email });
  if (userx) return res.status(400).json({ message: "Email is existed" })

  const user = new db.User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).json({
      userId: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { emailOrUsername } = req.body;
  console.log(req.body)
  db.User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
  }).exec((err, user) => {
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
        message: "Invalid Password!",
      });
    }

    // var token = jwt.sign({ user: user.id }, config.jwtSecret, {
    //   expiresIn: config.jwtExpiresIn
    // });

    const dataToSign = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    var token = ultil.createUserToken(dataToSign);

    res.status(200).json({
      auth: true,
      accessToken: token,
      username: user.email,
    });
  });
};

exports.resetPassword = (req, res) => {
  db.User.findOne({
    _id: req.userData.id,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = user.validatePassword(req.body.password);

    if (!passwordIsValid) {
      return res.status(400).send({
        message: "Invalid Current Password!",
      });
    }

    user.password = bcrypt.hashSync(req.body.newPassword, 8);
    user.save(function (err) {
      if (!err) {
        res.status(200).json({ message: "Update success" });
      } else {
        res.status(400).json({ message: err });
      }
    });
  });
};

exports.forgotPassword = (req, res) => {
  const email = req.body.email;

  db.User.findOne({
    email: email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const dataToSign = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(dataToSign, config.resetPassword, {
      expiresIn: "2m",
    });
    const data = {
      to: email,
      from: "no-reply@gmail.com",
      subject: "Active new password",
      html: `
        <p> Click http://localhost:5000/accounts/verify_reset_password /${token}</p>
        `,
    };

    user.updateOne({ resetLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({ message: "link error" });
      } else {
        let transport = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "e8f53a1c64703a",
            pass: "1b449b19b697ef",
          },
        });
        console.log(transport);

        transport.sendMail(data, function (err, info) {
          if (err) {
            return res.status(500).json({ message: "Error to send mail" });
          } else {
            return res.status(200).json({ message: "Sent email" });
          }
        });

        // const transporter = nodemailer.createTransport({
        //   service: 'gmail',
        //   auth: {
        //     user: 'huynhhuuthoi22@gmail.com',
        //     pass: 'huynhhuuthoi22' // naturally, replace both with your real credentials or an application-specific password
        //   }
        // });

        // const mailOptions = {
        //   from: 'huynhhuuthoi22@gmail.com',
        //   to: 'huuthoi01234@gmail.com',
        //   subject: 'Invoices due',
        //   text: 'Dudes, we really need your money.'
        // };

        // transporter.sendMail(mailOptions, function(error, info){
        //   if (error) {
        //   console.log(error);
        //   } else {
        //     console.log('Email sent: ' + info.response);
        //   }
        // });
      }
    });
  });
};

exports.verifyResetPassword = (req, res) => {
  const { resetLink, newPassword } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, config.resetPassword, (err, decodeData) => {
      if (err) {
        return res.status(401).json({ message: "Incorrect active link!" });
      }

      db.User.findOne({ resetLink }, (e, user) => {
        if (e || user) {
          return res.status(400).json({ message: "Token not exist!" });
        }
        user.updateOne(
          { password: bcrypt.hashSync(newPassword, 8) },
          (err, success) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Can not update new password" });
            } else {
              return res.status(200).json({ message: "Reset success" });
            }
          }
        );
      });
    });
  } else {
    return res.status(401).json({ message: "Authentication error!" });
  }
};

exports.getCurrentUser = (req, res) => {
  const { userData } = req;

  if (userData.id == null) {
    return res.status(401).json({ message: "UnAuthorization" });
  }
  db.User.findOne({
    _id: req.userData.id,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    var dataRes = {
      username: user.username,
      email: user.email,
    };
    return res.json({ data: dataRes });
  });
};
