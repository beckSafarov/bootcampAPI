const asyncHandler = require('../middleware/async'),
  Bootcamp = require('../models/btcModel'),
  User = require('../models/userModel'),
  ErrorResponse = require('../utils/errorResponse');

//@desc      Register User
//@route     GET/api/v1/auth/register
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

  res.status(200).json({ success: true });
});
