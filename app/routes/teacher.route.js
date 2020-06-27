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

router.get("/all", [authJwt.verifyToken], controller.findAll);
router.get("/all-nopaging", [authJwt.verifyToken], controller.findAllNoPaging);
router.post("/", [authJwt.verifyToken], controller.create);
router.get("/:id", [authJwt.verifyToken], controller.findById);
router.put("/:id", [authJwt.verifyToken], controller.update);
router.delete("/:id", [authJwt.verifyToken], controller.delete);
router.get("/block/:id", [authJwt.verifyToken], controller.blockTeacher);

module.exports = router;