const ErrorResponse = require('../utils/errorResponse'),
  asyncHandler = require('../middleware/async'),
  Reviews = require('../models/revModel'),
  Bootcamps = require('../models/btcModel');

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
