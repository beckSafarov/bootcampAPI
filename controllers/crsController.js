const asyncHandler = require('../middleware/async'),
  Course = require('../models/crsModel'),
  ErrorResponse = require('../utils/errorResponse'),
  Bootcamp = require('../models/btcModel');

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

//@desc      get a single course
//@route     GET/api/v1/courses/:id
//@access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc      add a new course
//@route     POST/api/v1/bootcamps/:bootcampId/courses
//@access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

//@desc      update course
//@route     PUT/api/v1/courses/:id
//@access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(
        `No course found with the id of ${req.params.bootcampId}`
      ),
      404
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc      delete course
//@route     DELETE/api/v1/courses/:id
//@access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course found with id of ${req.params.id}`, 404)
    );
  }
  course.remove();
  res.status(200).json({ success: true, msg: `Course successfully deleted` });
});
