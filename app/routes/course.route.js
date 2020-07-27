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

router.get("/all", controller.findAll);
router.get("/dropdown-by-id", [authJwt.verifyToken], controller.findAllByTeacherID);
router.get("/:id", controller.findByID);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);


router.get("/support/dropdown", controller.getDropdown);
router.get("/mycourses/all", [authJwt.verifyToken], controller.getMyCourse);
router.get("/confirm/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.confirmCourse);
router.post("/teacher/create", [authJwt.verifyToken, authJwt.isTeacher], controller.teacherCreate);
router.get("/:id/curriculum", [authJwt.verifyToken], controller.getAllCurriculumByCourseId);
router.get("/:id/diligences", [authJwt.verifyToken], controller.getDiligenceDateInCourse);
router.get("/:id/test-grade/result", [authJwt.verifyToken], controller.getTestGradeCourse);
router.post("/curriculums/video/detail", [authJwt.verifyToken], controller.getVideoById);

module.exports = router;
