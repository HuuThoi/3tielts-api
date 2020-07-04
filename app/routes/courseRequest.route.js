const express = require("express");
var router = express.Router();
const controller = require("../controllers/courseRequest.controller");
const { verifySignUp, authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
    next();
})

router.get("/all", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);

module.exports = router;
