const express = require("express");
var router = express.Router();
const controller = require("../controllers/admin.controller");

router.use(function (req, res, next) {});

router.get("/:limit/:offset", controller.findAll);
router.get("/:id", controller.getById)
router.post("", controller.create);
router.put('/:id', controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
