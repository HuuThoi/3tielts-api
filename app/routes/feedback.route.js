const express = require("express");
var router = express.Router();
const controller = require("../controllers/feedback.controller");
const { verifySignUp, authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
    next();
})

router.get("/all", [authJwt.verifyToken], controller.findAll);
router.get("/:id", [authJwt.verifyToken], controller.findByID);
router.post("/", [authJwt.verifyToken], controller.create);
router.put("/:id", [authJwt.verifyToken], controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
