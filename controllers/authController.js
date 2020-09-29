const asyncHandler = require('../middleware/async'),
  Bootcamp = require('../models/btcModel'),
  User = require('../models/userModel'),
  ErrorResponse = require('../utils/errorResponse'),
  sendEmail = require('../utils/sendEmail');

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

  sendTokenResponse(user, 200, res);
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
  //doing +password because password was excluded from select function in the model
  if (!user) {
    return next(new ErrorResponse(`Such user does not exist`, 401));
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Password is wrong`, 401));
  }

  sendTokenResponse(user, 200, res);
});

//@desc      Get logged in user
//@route     GET/api/v1/auth/me
//@access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await req.user;
  res.status(200).json({ success: true, data: user });
});

//@desc      Forgot password
//@route     POST/api/v1/auth/forgotpassword
//@access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse(`There is no such user`, 404));
  }

  //get reset token
  user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword`;
  const message = `You are receiving this email because you seem like a good peron. Put request here: ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorResponse('Email could not be sent. Please contact help', 500)
    );
  }
});

//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken(),
    options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
