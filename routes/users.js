const router = require('express').Router();
const {
  getUsers, createUser, updateProfile, updateAvatar, getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
