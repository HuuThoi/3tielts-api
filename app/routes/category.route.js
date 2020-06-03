const express = require("express");
var router = express.Router();
const controller = require("../controllers/category.controller");

router.use(function (req, res, next) {
  next();
});
// 1 API tạo mới
// 2 API lấy toàn bộ( có paging)
// 3 API lấy chi tiết theo ID
// 4 API cập nhật
// 5 API xóa

router.get("/:limit/:offset", controller.findAll);
router.get("/:id", controller.findByID);
// router.get("/info/:_id", userController.getInforUser)
router.post("", controller.create);
router.put("/update/:id", controller.update);
router.get("/support/dropdown", controller.getDropdown);

module.exports = router;
