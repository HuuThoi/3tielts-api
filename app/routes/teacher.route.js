const express = require('express');
const app = express();
const teacherController = require('../controllers/teacher.controller');
const EUserType = require('../enums/EUserTypes');
const passport = require('passport');
const userUtils = require('../helpers/user.utils');

// student update info
// app.post(
//   '/update-info',
//   passport.authenticate('jwt', { session: false }),
//   userUtils.checkRole(EUserType.TEACHER),
//   teacherController.updateInfoTeacher
// );
module.exports = app;