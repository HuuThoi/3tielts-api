const express = require("express");
// require("express-async-errors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const dbConfig = require("./app/config/database.config");
const route = require("./app/routes/index");
const cors = require("cors");
const app = express();

app.use(cors());
// require('./passport');   temp comment
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));


//connecting to the database + để tránh warning các deprecate thì thêm 3 dòng .set vào
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose
    .connect(dbConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.log("Could not connected to the database. Exiting now...", err);
        process.exit();
    });

//route default
app.get("/", (req, res) => {
    res.json({ message: "Ielts web " });
});

//route
app.use("/accounts", route.AccountRoute);
app.use('/categories', route.CategoryRoute);
app.use('/comments', route.CommentRoute)
app.use('/courses', route.CourseRoute)
app.use("/documents", route.DocumentRoute);
app.use("/questions", route.QuestionRoute);
app.use('/schedules', route.ScheduleRoute)
app.use("/shifts", route.ShiftRoute);
app.use('/users', route.UserRoute);
app.use('/admins', route.AdminRoute);
// app.use('/students', route.StudentRoute);
app.use('/teachers', route.TeacherRoute);
app.use('/classs', route.ClassRoute);

//caych error
app.use((req, res, next) => {
	res.status(404).send("NOT FOUND");
});

app.use(function (err, req, res, next) {
	console.log(err.stack);
	// console.log(err.status);
	const statusCode = err.status || 500;
	res.status(statusCode).send("View error log on console.");
});

//running app 
app.listen(parseInt(process.env.PORT) || 5000, () => {
    console.log('Server is listening http://localhost:5000');
});
module.exports = app;