const ErrorResponse = require('../utils/errorResponse');

const validateCommit = (object, msg, req, res, next) => {
  if (req.user.id != object.user && req.user.role !== 'admin') {
    return next(new ErrorResponse(msg, 401));
  }
};

module.exports = validateCommit;
