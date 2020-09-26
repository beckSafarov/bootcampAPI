const express = require('express'),
  { register, login, getMe } = require('../controllers/authController'),
  router = express.Router(),
  { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
