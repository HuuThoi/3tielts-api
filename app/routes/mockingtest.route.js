const express = require("express");
var router = express.Router();
const controller = require("../controllers/mockingtest.controller");

router.use(function (req, res, next) {next()});

router.get("/:limit/:offset", controller.findAll);
router.get("/all", controller.find);
// router.get("/:id", controller.getById)
router.post("/", controller.create);
router.put('/:id', controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
