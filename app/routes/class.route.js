const express = require("express");
var router = express.Router();
const controller = require("../controllers/class.controller");

router.use(function (req, res, next) {
  next();
});

router.get("/all", controller.findAll);
router.post("/", controller.create);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
