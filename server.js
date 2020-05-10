const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const dbConfig = require('./config/database.config');

const userRouter = require('./app/routes/user.route');
const categoryRouter = require('./app/routes/category.route');
const commentRouter = require('./app/routes/comment.route');
const courseRouter = require('./app/routes/course.route');
const scheduleRouter = require('./app/routes/schedule.route');

const cors = require('cors');

//create express app
const app = express();
app.use(cors());
// require('./passport');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

// app.use('/admin', adminRouter);
// app.use('/admin/student', studentRouter);
// app.use('/admin/teacher', teacherRouter);
app.use('/user', userRouter);
app.use('/category',categoryRouter)
app.use('/comment',commentRouter)
app.use('/course',courseRouter)
app.use('/schedule',scheduleRouter)


//connecting to the database
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch(err => {
    console.log('Could not connected to the database. Exiting now...', err);
    process.exit();
  });

app.get('/', (req, res) => {
  res.json({ message: 'Simple app' });
});

app.listen(parseInt(process.env.PORT) || 5000, () => {
  console.log('Server is listening http://localhost:5000');
});
// module.exports = app;
