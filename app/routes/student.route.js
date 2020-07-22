const express = require("express");
var router = express.Router();
const controller = require("../controllers/student.controller");
const { authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

//router.get("/:limit/:offset", controller.findAll);
// router.get("/:name", controller.fin)
//router.post("/register", controller.register);
// router.put('/update', controller.);

router.get("/all", [authJwt.verifyToken, authJwt.isManagePermission], controller.findAll);
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.findById);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
router.get("/upgrade/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.upgradeStudent);

module.exports = router;
