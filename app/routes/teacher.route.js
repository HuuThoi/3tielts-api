const express = require("express");
var router = express.Router();
const controller = require("../controllers/teacher.controller");
const { authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get("/all", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
router.get("/all-nopaging", [authJwt.verifyToken, authJwt.isAdmin], controller.findAllNoPaging);
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.findById);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
router.get("/block/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.blockTeacher);

router.get("/support/dropdown", controller.getDropdown);

module.exports = router;