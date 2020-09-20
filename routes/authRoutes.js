const express = require('express'),
  { register } = require('../controllers/authController'),
  router = express.Router();

router.post('/register', register);

module.exports = router;
