const express = require('express'),
  path = require('path'),
  dotenv = require('dotenv'),
  app = express(),
  morgan = require('morgan'),
  colors = require('colors'),
  fileupload = require('express-fileupload'),
  errorHandler = require('./middleware/error'),
  PORT = process.env.PORT || 5000;

//Body parser
app.use(express.json());

//load env vars
dotenv.config({ path: './config/config.env' });

//bringing route files and others
const bootcamps = require('./routes/btcRoutes'),
  courses = require('./routes/crsRoutes'),
  connectDB = require('./config/db'); //connecting to the database

connectDB(); //activating database

//dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//file upload
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//activating || mounting routes to bootcamps
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler); //in case if there happens error in app.use, next() is called there and it calls the error handler function

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

//handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('unhandledRejection', err.message);
  //close server & exit process
  server.close();
});

//handling crashes
process.on('uncaughtException', (err, promise) => {
  console.log('uncaughtException', err.message);
  //close server & exit process
  server.close();
});

//killing server
process.on('SIGTERM', (err, promise) => {
  console.log('SIGTERM', err.message);
  //close server & exit process
  server.close();
});
