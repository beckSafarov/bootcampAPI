const express = require('express'),
  router = express.Router(),
  {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
  } = require('../controllers/btcController'),
  Bootcamp = require('../models/btcModel'),
  advancedResults = require('../middleware/advancedResults'),
  { protect, authorize } = require('../middleware/auth'),
  reviews = require('./revRoutes'),
  courseRouter = require('./crsRoutes');

router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviews);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
