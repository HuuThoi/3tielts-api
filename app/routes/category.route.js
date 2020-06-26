const express = require("express");
var router = express.Router();
const controller = require("../controllers/category.controller");
const { verifySignUp, authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
    next();
})

router.get("/all", [authJwt.verifyToken, authJwt.isManagePermission], controller.findAll);
router.get("/:id", [authJwt.verifyToken, authJwt.isManagePermission], controller.findByID);
router.post("/", [authJwt.verifyToken, authJwt.isManagePermission], controller.create);
router.put("/:id", [authJwt.verifyToken, authJwt.isManagePermission], controller.update);
router.get("/support/dropdown", controller.getDropdown);
router.delete("/:id", controller.delete);

module.exports = router;
