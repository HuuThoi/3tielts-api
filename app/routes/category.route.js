const express = require("express");
const app = express();
const controller = require("../controllers/category.controller");


// 1 API tạo mới
// 2 API lấy toàn bộ( có paging)
// 3 API lấy chi tiết theo ID
// 4 API cập nhật
// 5 API xóa

app.get("/:limit/:offset", controller.findAll)
app.get("/:id", controller.findByID)
// app.get("/info/:_id", userController.getInforUser)

app.post('/create', controller.create);
app.post('/update', controller.update);
// app.post('/login', ususerControllerers.login); //login with email and password

module.exports = app;
