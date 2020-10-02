const express = require('express'),
  {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
  } = require('../controllers/authController'),
  router = express.Router(),
  { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
