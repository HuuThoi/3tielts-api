const express = require("express");
const app = express();
const userController = require("../controllers/user.controller");

app.get("/", userController.findAll)
app.get("/info/:_id", userController.getInforUser)

app.post('/register', userController.register);
app.post('/login', userController.login); //login with email and password

module.exports = app;
