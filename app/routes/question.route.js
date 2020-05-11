const express = require("express");
const app = express();
const Controller = require("../controllers/comment.controller");


// 1 API tạo mới
// 2 API lấy toàn bộ( có paging)
// 3 API lấy chi tiết theo ID
// 4 API cập nhật
// 5 API xóa

app.get("/:limit/:offset", Controller.findAll)
app.get("/:id", Controller.findByID)


app.post('/create', Controller.create);
app.post('/update', Controller.update);
app.delete('/',Controller.delete)

module.exports = app;
