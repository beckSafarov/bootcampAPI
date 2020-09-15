const express = require('express'),
  router = express.Router({ mergeParams: true }),
  { getCourses } = require('../controllers/crsController');

router.route('/').get(getCourses);

module.exports = router;
