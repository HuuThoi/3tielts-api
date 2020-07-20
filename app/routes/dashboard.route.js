const express = require("express");
var router = express.Router();
const controller = require("../controllers/dashboard.controller");
const { authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
    next();
})

//admin
// get basic info

router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.getBasicInfoForAdmin);


// teacher
router.get("/teacher", [authJwt.verifyToken, authJwt.isTeacher], controller.getBasicInfoForTeacher);


//student
router.get("/student", [authJwt.verifyToken, authJwt.isStudent], controller.getBasicInfoForStudent);


module.exports = router;
