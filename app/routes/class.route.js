const express = require("express");
const app = express();
const classController = require("../controllers/class.controller");

app.get("/", classController.findAll)
app.get("/info/:_id", classController.getInforClass)
app.post("/create",classController.create)

module.exports = app;
