const ErrorResponse = require('../utils/errorResponse'),
  asyncHandler = require('../middleware/async'),
  Reviews = require('../models/revModel'),
  Bootcamps = require('../models/btcModel'),
  validateCommit = require('../middleware/validateCommit');

//@desc        Get all reviews
//@route 1     GET/api/v1/reviews
//@route 2     GET/api/v1/bootcamp/bootcampId/reviews
//@access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Reviews.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc        Get a single review
//@route       GET/api/v1/review/:id
//@access      Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Reviews.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc        add review
//@route       POST/api/v1/bootcamps/:bootcampId/reviews
//@access      Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamps.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with the id of ${req.params.id}`,
        404
      )
    );
  }

  const review = await Reviews.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

//@desc        update review
//@route       PUT/api/v1/reviews/:id
//@access      Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Reviews.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  const message = 'You are not authorized to update this review';
  validateCommit(review, message, req, res, next);

  req.body.bootcamp = req.params.id;
  req.body.user = req.user.id;
  review = await Reviews.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc        delete review
//@route       DELETE/api/v1/reviews/:id
//@access      Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Reviews.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  const message = 'You are not authorized to delete this review';
  validateCommit(review, message, req, res, next);

  review = await Reviews.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: `The review has been successfully deleted`,
  });
});
