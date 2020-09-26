const express = require('express'),
  router = express.Router({ mergeParams: true }),
  {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
  } = require('../controllers/crsController'),
  { protect } = require('../middleware/auth'),
  Course = require('../models/crsModel'),
  advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, addCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
