const geocoder = require('../utils/geocoder'),
  Bootcamp = require('../models/btcModel'),
  asyncHandler = require('../middleware/async'),
  ErrorResponse = require('../utils/errorResponse');

//@desc      Get all bootcamps
//@route     GET/api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

//@desc      Get single bootcamp
//@route     GET/api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc      create a new bootcamp
//@route     POST/api/v1/bootcamps
//@access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc      update bootcamp
//@route     PUT/api/v1/bootcamps/:id
//@access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc      delete bootcamp
//@route     DELETE/api/v1/bootcamps/:id
//@access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, msg: `Item successfully deleted` });
});

//@desc      get bootcamps within a radius
//@route     GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  //get latitude/longtitude from geocoder
  const loc = await geocoder.geocode(zipcode),
    lat = loc[0].latitude,
    lng = loc[0].longtitude;

  //calc radius using radians
  //divide distance by radius of Earth
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
