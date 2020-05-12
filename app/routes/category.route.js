const express = require("express");
var router = express.Router();
const controller = require("../controllers/category.controller");

// 1 API tạo mới
// 2 API lấy toàn bộ( có paging)
// 3 API lấy chi tiết theo ID
// 4 API cập nhật
// 5 API xóa

router.get("/:limit/:offset", controller.findAll)
router.get("/:id", controller.findByID)
// router.get("/info/:_id", userController.getInforUser)
router.post('/create', controller.create);
router.post('/update', controller.update);
// router.post('/login', ususerControllerers.login); //login with email and password

module.exports = router;
