const express = require("express");
var router = express.Router();
const controller = require("../controllers/course.controller");

router.use(function (req, res, next) {
    next();
})

// 1 API tạo mới
// 2 API lấy toàn bộ( có paging)
// 3 API lấy chi tiết theo ID
// 4 API cập nhật
// 5 API xóa

router.get("/", controller.findAll);
router.get("/:id", controller.findByID);
router.post("/", controller.create);
router.put("/update/:id", controller.update);
router.delete("/", controller.delete);

router.get("/support/dropdown", controller.getDropdown);
router.get("/:id/curriculum", controller.getAllCurriculumByCourseId);
router.post("/curriculums/video/detail", controller.getVideoById);

module.exports = router;
