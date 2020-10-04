const express = require('express'),
  router = express.Router({ mergeParams: true }),
  {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  } = require('../controllers/usersController'),
  { protect, authorize } = require('../middleware/auth'),
  User = require('../models/userModel'),
  advancedResults = require('../middleware/advancedResults');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
