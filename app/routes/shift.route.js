const express = require("express");
const shiftController = require("../controllers/shift.controller");
const {authJwt } = require("../middlewares/index");

var router = express.Router();

  router.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/all",[authJwt.verifyToken],shiftController.findAll);
  router.get("/all-nopaging",[authJwt.verifyToken],shiftController.findAllNoPaging);
  router.post("/",[authJwt.verifyToken], shiftController.create);
  router.get("/:id",[authJwt.verifyToken], shiftController.findById);
  router.put("/:id",[authJwt.verifyToken], shiftController.update);
  router.delete("/:id",[authJwt.verifyToken], shiftController.delete);

module.exports = router;