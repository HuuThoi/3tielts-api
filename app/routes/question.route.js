const express = require("express");
var router = express.Router();
const controller = require("../controllers/question.controller");


// 1 API tạo mới
// 2 API lấy toàn bộ( có paging)
// 3 API lấy chi tiết theo ID
// 4 API cập nhật
// 5 API xóa

router.get("/:limit/:offset", controller.findAll)
router.get("/:id", controller.findByID)
router.post('/create', controller.create);
router.put('/update', controller.update);
router.delete('/', controller.delete)

module.exports = router;
