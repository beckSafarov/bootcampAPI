const asyncHandler = require('../middleware/async'),
  Bootcamp = require('../models/btcModel'),
  User = require('../models/userModel'),
  ErrorResponse = require('../utils/errorResponse');

//@desc      Register User
//@route     GET/api/v1/auth/register
//@access    Public
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
