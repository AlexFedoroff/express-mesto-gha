const router = require('express').Router();
const {
  getUsers, updateProfile, updateAvatar, getUser, getCurrentUser,
} = require('../controllers/users');

const { avatarValidate, updateProfileValidate, validateGetUser } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateGetUser, getUser);
router.patch('/me', updateProfileValidate, updateProfile);
router.patch('/me/avatar', avatarValidate, updateAvatar);

module.exports = router;
