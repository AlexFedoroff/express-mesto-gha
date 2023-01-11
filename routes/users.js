const router = require('express').Router();
const {
  getUsers, updateProfile, updateAvatar, getUser, getCurrentUser,
} = require('../controllers/users');

const { avatarValidate } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', getCurrentUser);
// router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', avatarValidate, updateAvatar);

module.exports = router;
