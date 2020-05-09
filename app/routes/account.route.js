const express = require("express");
const accountController = require("../controllers/account.controller copy");
const { verifySignUp, authJwt } = require("../middlewares/index");

var router = express.Router();

  router.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post(
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    accountController.signup
  );

  router.post("/signin", accountController.signin);

//   app.get("/all",[authJwt.verifyToken], accountController.all);

//   app.get("all2",
//     [authJwt.verifyToken, authJwt.isModerator],
//     accountController.all2
//   );

module.exports = router;