const express = require("express");
const documentController = require("../controllers/document.controller");
const {authJwt } = require("../middlewares/index");

var router = express.Router();

  router.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/all",[authJwt.verifyToken],documentController.findAll);
  router.get("/all-nopaging",[authJwt.verifyToken],documentController.findAllNoPaging);
  router.post("/",[authJwt.verifyToken], documentController.create);
  router.get("/:id",[authJwt.verifyToken], documentController.findById);
  router.put("/:id",[authJwt.verifyToken], documentController.update);
  router.delete("/:id",[authJwt.verifyToken], documentController.delete);

module.exports = router;