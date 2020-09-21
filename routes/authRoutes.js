const express = require('express'),
  { register, login } = require('../controllers/authController'),
  router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;
