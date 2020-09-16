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

  //remove the removeFields members
  removeFields.forEach((param) => delete reqQuery[param]);

  //turn the query into a string
  let queryStr = JSON.stringify(reqQuery);

  //convert lt, gt, etc into comparison operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte)|in\b/g,
    (match) => `$${match}`
  );

  //search for the queryStr, or required resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: 'courses',
    select: 'title description',
  });

  //Function for selecting certain fields
  if (req.query.select) {
    //join the selected fields. E.g. select=name,description, => [select description]
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields); //search for the selected fields
  }

  //Function for sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Function for pagination
  const page = parseInt(req.query.page, 10) || 1, //required page number
    limit = parseInt(req.query.limit, 10) || 10, //bootcamps per page
    startIndex = (page - 1) * limit, //the first bootcamp to be sent
    endIndex = page * limit, //the last bootcamp to be sent
    total = await Bootcamp.countDocuments(); //total number of documents to be sent

  //start from startIndex bootcamp and show limit number of bootcamps per page
  query = query.skip(startIndex).limit(limit);

  //executing the query
  const bootcamps = await query;

  //object to store pagination results and stats
  const pagination = {};

  //data about the next page
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  //data about the previous page
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
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
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
