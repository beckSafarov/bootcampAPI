const express = require('express'),
  dotenv = require('dotenv'),
  app = express(),
  PORT = process.env.PORT || 5000;

//load env vars
dotenv.config({ path: './config/config.env' });

app.get('/api/v1/bootcamps', (request, response) => {
  response.json({ success: true, msg: 'Show all bootcamps' });
});

app.get('/api/v1/bootcamps/:id', (request, response) => {
  response.json({ success: true, msg: 'Show bootcamp ' + request.params.id });
});

app.post('/api/v1/bootcamps', (request, response) => {
  response.json({ success: true, msg: 'Create a new bootcamp' });
});

app.put('/api/v1/bootcamps/:id', (request, response) => {
  response.json({
    success: true,
    msg: `Update bootcamp ${request.params.id}`,
  });
});

app.delete('/api/v1/bootcamps/:id', (request, response) => {
  response.json({ success: true, msg: `Delete bootcamp ${request.params.id}` });
});

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
