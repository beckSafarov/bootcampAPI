const asyncHandler = require('../middleware/async'),
  geocoder = require('../utils/geocoder'),
  Bootcamp = require('../models/btcModel'),
  ErrorResponse = require('../utils/errorResponse');

//@desc      Get all bootcamps
//@route     GET/api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query,
    //copy req.query
    reqQuery = { ...req.query };

  //fields to execute
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //loop over removeFields
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  //find comparison operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte)|in\b/g,
    (match) => `$${match}`
  );

  //finding the resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //Selecting certain fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sorting
  if (req.query.sort) {
    // const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(req.query.sort);
  } else {
    query = query.sort('-createdAt');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1,
    limit = parseInt(req.query.limit, 10) || 10,
    startIndex = (page - 1) * limit,
    endIndex = page * limit,
    total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //executing the query
  const bootcamps = await query;

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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
    //NodeGeocoder(options).geocode(zipcode)
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
