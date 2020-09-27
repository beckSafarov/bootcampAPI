const asyncHandler = require('../middleware/async'),
  path = require('path'),
  geocoder = require('../utils/geocoder'),
  Bootcamp = require('../models/btcModel'),
  ErrorResponse = require('../utils/errorResponse');

//@desc      Get all bootcamps
//@route     GET/api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  //add user to req.body
  req.body.user = req.user.id;
  //check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  //if the user is ot an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already published a bootcamp`
      ),
      400
    );
  }
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
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  //make sure either the author or admin is updating
  if (req.user.id != bootcamp.user && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this course`, 401));
  }

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

//@desc      delete bootcamp
//@route     DELETE/api/v1/bootcamps/:id
//@access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  //make sure either the author or admin is deleting
  if (req.user.id != bootcamp.user && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this course`, 401));
  }

  bootcamp.remove();
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
    lng = loc[0].longitude;

  //calc radius using radians
  //divide distance by radius of Earth
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  console.log(bootcamps);
  console.log(`latitude: ${lat}\nlongitude: ${lng}\nradians: ${radius}`);
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc      upload photo for a bootcamp
//@route     PUT /api/v1/bootcamps/:id/photo
//@access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  //make sure either the author or admin is deleting
  if (req.user.id != bootcamp.user && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this course`, 401));
  }

  //if file was not sent, fire the following error
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 404));
  }

  //make sure the file is an image
  const file = req.files.file;
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 404));
  }

  //check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `The image size should not exceed ${process.env.MAX_FILE_UPLOAD}`,
        404
      )
    );
  }

  //create custom file name": "
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      next(new ErrorResponse(`Sorry, something went wrong in the server`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      msg: 'Image has been successfully uploaded',
      data: file.name,
    });
  });
});
