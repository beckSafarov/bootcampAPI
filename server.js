const express = require('express'),
  dotenv = require('dotenv'),
  app = express(),
  bootcamps = require('./routes/bootcamps'),
  morgan = require('morgan'),
  PORT = process.env.PORT || 5000;

//load env vars
dotenv.config({ path: './config/config.env' });

//dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//routs to bootcamps
app.use('/api/v1/bootcamps', bootcamps);

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
