const express = require("express");
var router = express.Router();
const controller = require("../controllers/curriculum.controller");
const { verifySignUp, authJwt } = require("../middlewares/index");

router.use(function (req, res, next) { next() });

router.get("/:limit/:offset", [authJwt.verifyToken], controller.findAll);
// router.get("/:id", controller.getById)
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.update);
// router.delete("/:id", controller.delete);

module.exports = router;
