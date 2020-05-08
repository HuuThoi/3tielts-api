const express = require("express");
const app = express();
const studentController = require("../controllers/student.controller");
const EUserType = require("../enums/EUserTypes");
const passport = require("passport");
const userUtils = require("../helpers/user.utils");

app.get("/", studentController.findAll);

// // student update info
// app.post('/student/update-info',
//     passport.authenticate('jwt', { session: false }),
//     userUtils.checkRole(EUserType.STUDENT),
//     studentController.updateInfoStudent);

module.exports = app;