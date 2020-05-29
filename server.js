const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const dbConfig = require("./app/config/database.config");
const route = require("./app/routes/index");
const cors = require("cors");
const app = express();
const db = require("./app/models/index");

app.use(cors());
// require('./passport');   temp comment
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));

//swagger
const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
app.use(express.static(pathToSwaggerUi));

var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//add seed data
app.use("/seed-data", () => {
  db.User.countDocuments({}).exec((err, count) => {
    if (err) {
      console.error(err);
      return;
    }
    if (count == 0) {
      db.User.create(
        {
          email: "admin@test.com",
          username: "admin",
          password: "admin123",
        },
        (err, seedUser) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Seed superuser created");
        }
      );
    }
  });
});

//connecting to the database
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
app.use("/classs", route.ClassRoute);

//running app
app.listen(parseInt(process.env.PORT) || 3000, () => {
  console.log("Server is listening http://localhost:3000");
});
module.exports = app;
