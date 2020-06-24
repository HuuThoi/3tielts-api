const express = require("express");
var router = express.Router();
const controller = require("../controllers/class.controller");
const { verifySignUp, authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
  next();
});

router.get("/all", [authJwt.verifyToken], controller.findAll);
router.post("/", [authJwt.verifyToken], controller.create);
router.get("/:id", [authJwt.verifyToken], controller.findById);
router.put("/:id", [authJwt.verifyToken], controller.update);
router.delete("/:id", [authJwt.verifyToken], controller.delete);

router.get("/support/dropdown", controller.getDropdown);
router.get("/classes-in-day", controller.getAllClassesInDayForStudent);
router.get("/classes-in-day-teacher", controller.getAllClassesInDayForTeacher);

module.exports = router;
