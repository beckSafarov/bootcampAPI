const errorHandler = (err, req, res, next) => {
  //log to console for dev
  console.log(err.stack.red);
  console.log(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server error',
  });
};

module.exports = errorHandler;
