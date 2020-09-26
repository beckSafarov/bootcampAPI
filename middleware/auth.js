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
  }

  // else if(req.cookies.token){
  //     token = req.cookies.token
  // }

  //make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  req.user = await User.findById(decoded.id);
  next();
});

//jwt.verify is returning the id, iat and exp object members. They have been created in the userModel
// when that particular json token was generated.
