const express = require('express'),
  router = express.Router({ mergeParams: true }),
  {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
  } = require('../controllers/crsController');

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
