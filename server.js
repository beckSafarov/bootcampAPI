const express = require('express'),
  dotenv = require('dotenv'),
  app = express(),
  morgan = require('morgan'),
  colors = require('colors'),
  errorHandler = require('./middleware/error'),
  PORT = process.env.PORT || 5000;

//Body parser
app.use(express.json());

//load env vars
dotenv.config({ path: './config/config.env' });

const bootcamps = require('./routes/btcRoutes'), //bringing btcRoutes file with routes
  connectDB = require('./config/db'); //connecting to the database

connectDB(); //activating database

//dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//activating routes to bootcamps
app.use('/api/v1/bootcamps', bootcamps);

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
