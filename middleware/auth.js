const jwt = require('jsonwebtoken'),
  asyncHandler = require('./async'),
  ErrorResponse = require('../utils/errorResponse'),
  User = require('../models/userModel');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  //make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  req.user = await User.findById(decoded.id);
  next();
});

//jwt.verify is returning the id, iat and exp object members. They have been created in the userModel when that particular json token was generated. When the token was created, those details have been hashed and jammed into the generated token. Same is with jwt secret, but it is not returned publicly to keep it secret.
//later req.user is being assigned to the whole user model with all of its data in the database

//grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
