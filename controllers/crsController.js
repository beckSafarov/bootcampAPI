const asyncHandler = require('../middleware/async'),
  Course = require('../models/crsModel'),
  ErrorResponse = require('../utils/errorResponse');

//@desc      Get courses
//@route     GET/api/v1/courses
//@route     GET/api/v1/bootcamps/:bootcampId/courses
//@access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = await Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = await Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  if (!query) {
    return next(
      new ErrorResponse(`Courses not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    count: query.length,
    data: query,
  });
});
