const express = require("express");
var router = express.Router();
const controller = require("../controllers/admin.controller");
const { authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
    next();
});

router.get("/all", [authJwt.verifyToken,  authJwt.isAdmin],  controller.findAll);
router.get("/:id",  [authJwt.verifyToken], controller.updateBlockStatus)
router.post("/",  [authJwt.verifyToken], controller.create);

module.exports = router;
