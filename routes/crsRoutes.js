const express = require('express'),
  router = express.Router({ mergeParams: true }),
  {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
  } = require('../controllers/crsController'),
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
  .post(addCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
