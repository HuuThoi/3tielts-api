const express = require("express");
// require("express-async-errors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const dbConfig = require("./app/config/database.config");
const route = require("./app/routes/index");
const cors = require("cors");
const app = express();
const db = require("./app/models/index");
const bcrypt = require("bcryptjs");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("connected socket");
  socket.on("message", ({ name, message }) => {
    console.log({ name, message });
    io.emit("message", { name, message });
  });
});

app.use(cors());
// require('./passport');   temp comment
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));

//socket io

//connecting to the database + để tránh warning các deprecate thì thêm 3 dòng .set vào
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
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

app.get("/", (req, res) => {
  res.json({ message: "Ielts Web" });
});

//seed data
app.get("/seed-data", (req, res) => {
  // const User = db.User;
  // User.countDocuments({}).exec((err, count) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   if (count == 0) {
  //     User.create(
  //       {
  //         email: "admin@test.com",
  //         username: "admin",
  //         password: bcrypt.hashSync("admin123", 8),
  //       },
  //       (err, seedUser) => {
  //         if (err) {
  //           console.error(err);
  //           return;
  //         }
  //       }
  //     );
  //   }
  // });
  const Class = db.Class;
  for (var i = 27; i < 30; i++) {
    let num = i + 1;
    Class.create(
      {
        name: "Class " + num,
        status: 1,
        courseID: "5ed72fc0699d0c2cf453b7be",
        categoryID: "5ed72fc0699d0c2cf453b7b9",
      },
      (err, seedUser) => {
        if (err) {
          console.error(err);
          return;
        }
        res.statusCode = 200;
      }
    );
  }

  // let Category = db.Category;

  // for (var i = 10; i < 15; i++) {
  //   let num = i + 1;
  //   Category.create(
  //     {
  //       name: "Category " + num,
  //       icons: "Icon " + num,
  //       level: num,
  //       status: 1,
  //       typeID: num,
  //     },
  //     (err, seedUser) => {}
  //   );
  // }
  let Course = db.Course;
  for (var i = 10; i < 15; i++) {
    let num = i + 1;
    Course.create(
      {
        name: "Course " + num,
        shortDesc: "Description " + num,
        content: "Content of Course " + num,
        dateStart: "3/6/2020",
        dateEnd: "3/12/2020",
        tuition: "Tuition " + num,
      },
      (err, seedUser) => { }
    );
  }
  res.json({ message: "Seed data created" });
});

//route
app.use("/accounts", route.AccountRoute);
app.use("/categories", route.CategoryRoute);
app.use("/comments", route.CommentRoute);
app.use("/courses", route.CourseRoute);
app.use("/documents", route.DocumentRoute);
app.use("/questions", route.QuestionRoute);
app.use("/schedules", route.ScheduleRoute);
app.use("/shifts", route.ShiftRoute);
app.use("/users", route.UserRoute);
app.use("/admins", route.AdminRoute);
// app.use('/students', route.StudentRoute);
app.use("/teachers", route.TeacherRoute);
app.use("/classes", route.ClassRoute);

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
http.listen(parseInt(process.env.PORT) || 8080, () => {
  console.log("Server is listening http://localhost:8080");
});
module.exports = app;
