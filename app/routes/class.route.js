const express = require("express");
var router = express.Router();
const classController = require("../controllers/class.controller");

router.use(function (req, res, next) {
  next();
});

router.get("/", classController.findAll);
router.get("/info/:id", classController.getInforClass);
router.post("/create", classController.create);

module.exports = router;
