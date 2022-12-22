const router = require('express').Router();
const cardsRoutes = require('./cards');
const usersRoutes = require('./users');

const { NOT_FOUND_STATUS } = require('../utils/errors');

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);

router.use('*', (req, res) => res.status(NOT_FOUND_STATUS)
  .send({ message: '404 - Страница не найдена ' }));

module.exports = router;
