const ErrorResponse = require('../utils/errorResponse'),
  asyncHandler = require('../middleware/async'),
  Reviews = require('../models/revModel'),
  Bootcamps = require('../models/btcModel'),
  express = require('express'),
  router = express.Router(),
  advancedResults = require('../middleware/advancedResults');

const {
  getReviews,
  getBootcampReviews,
} = require('../controllers/revController');

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(
  advancedResults(Reviews, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getReviews
);

module.exports = router;
