const express = require("express");
var router = express.Router();
const controller = require("../controllers/course.controller");
const { authJwt } = require("../middlewares/index");

router.use(function (req, res, next) {
    next();
})

// 1 API tạo mới
// 2 API lấy toàn bộ( có paging)
// 3 API lấy chi tiết theo ID
// 4 API cập nhật
// 5 API xóa

router.get("/all", [authJwt.verifyToken], controller.findAll);
router.get("/:id", [authJwt.verifyToken], controller.findByID);
router.post("/", [authJwt.verifyToken, authJwt.isManagePermission], controller.create);
router.put("/:id", [authJwt.verifyToken, authJwt.isManagePermission], controller.update);
router.delete("/", [authJwt.verifyToken, authJwt.isManagePermission], controller.delete);

router.get("/support/dropdown", [authJwt.verifyToken, authJwt.isManagePermission], controller.getDropdown);
router.get("/mycourses/all", [authJwt.verifyToken], controller.getMyCourse);
router.get("/confirm/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.confirmCourse);
router.post("/teacher/create", [authJwt.verifyToken, authJwt.isTeacher], controller.teacherCreate);
router.get("/:id/curriculum", [authJwt.verifyToken], controller.getAllCurriculumByCourseId);
router.get("/:id/diligences", [authJwt.verifyToken], controller.getDiligenceDateInCourse);
router.post("/curriculums/video/detail", [authJwt.verifyToken], controller.getVideoById);

module.exports = router;
