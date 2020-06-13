const express = require("express");
var router = express.Router();
const controller = require("../controllers/class.controller");
const { verifySignUp, authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
  next();
});

router.get("/all",[authJwt.verifyToken], controller.findAll);
router.post("/", controller.create);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

router.get("/support/dropdown", controller.getDropdown);

module.exports = router;
