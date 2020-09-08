const express = require('express'),
  dotenv = require('dotenv'),
  app = express(),
  morgan = require('morgan'),
  colors = require('colors'),
  PORT = process.env.PORT || 5000;

//load env vars
dotenv.config({ path: './config/config.env' });

const bootcamps = require('./routes/bootcamps'),
  connectDB = require('./config/db');

connectDB();

//dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//routs to bootcamps
app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

//handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //close server & exit process
  server.close(process.exit(1));
});
