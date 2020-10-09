const ErrorResponse = require('../utils/errorResponse'),
  asyncHandler = require('../middleware/async'),
  Reviews = require('../models/revModel'),
  Bootcamps = require('../models/btcModel'),
  express = require('express'),
  router = express.Router({ mergeParams: true }),
  advancedResults = require('../middleware/advancedResults');

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/revController');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Reviews, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
