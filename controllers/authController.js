const asyncHandler = require('../middleware/async'),
  Bootcamp = require('../models/btcModel'),
  User = require('../models/userModel'),
  ErrorResponse = require('../utils/errorResponse');

//@desc      Register User
//@route     POST/api/v1/auth/register
//@access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create user
  const user = await User.create({
    name, //equivalent to: name = name,
    email,
    password,
    role,
  });

  //create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

//@desc      Login User
//@route     POST/api/v1/auth/login
//@access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password fields
  if (!email || !password) {
    return next(new ErrorResponse(`Please provide an email and password`, 400));
  }

  //check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse(`Such user does not exist`, 401));
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Password is wrong`, 401));
  }

  //create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
