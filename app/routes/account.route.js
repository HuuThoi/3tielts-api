const express = require("express");
var router = express.Router();
const controller = require("../controllers/account.controller");
const { verifySignUp, authJwt } = require("../middlewares/index");
const jwt = require("jsonwebtoken");
const config = require("../config/jwt-secret.config");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup", controller.signup);

router.post("/signin", controller.signin);

//   app.get("/all",[authJwt.verifyToken], controller.all);

//   app.get("all2",
//     [authJwt.verifyToken, authJwt.isModerator],
//     controller.all2
//   );

router.get("/me", [authJwt.verifyToken], async (req, res) => {
  console.log("get profile");
  console.log("req", req.userData);
})

router.post("/verify-me", async (req, res) => {
  if(!req.body.token) 
  return res.status(200).json({
    isValid: false
  });
  
  jwt.verify(req.body.token, config.jwtSecret, (err, decoded) => {
    if (!err) {
    return res.status(200).json({
        isValid: true
      });
    }else{
      return res.status(200).json({
        isValid: false
      });
    }
  })
})

router.post('/forgot_password', controller.forgotPassword);
router.post('/verify_reset_password', controller.verifyResetPassword);
router.post('/update_password', [authJwt.verifyToken], controller.resetPassword)

module.exports = router;
