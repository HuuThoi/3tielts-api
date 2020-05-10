const express = require("express");
const app = express();
const userController = require("../controllers/user.controller");


// 1 API tạo mới
// 2 API lấy toàn bộ( có paging, search, sort)
// 3 API lấy chi tiết theo ID
// 4 API cập nhật
// 5 API xóa
// 6. API nâng cấp học viên
// 7 API hạ cấp học viên

app.get("/:limit/:offset", userController.findAll)
app.get("/:name", userController.findByName)
// app.get("/info/:_id", userController.getInforUser)

app.post('/register', userController.register);
app.post('/update', userController.update);
// app.post('/login', ususerControllerers.login); //login with email and password

module.exports = app;
