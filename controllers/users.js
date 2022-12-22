const User = require('../models/user');
const {
  OK_STATUS, NOT_FOUND_STATUS, BAD_REQUEST_STATUS, SERVER_ERROR_STATUS,
} = require('../utils/errors');

/* const NotFoundError = require('../utils/notFound');
const BadRequestError = require('../utils/badRequest');
const ServerError = require('../utils/serverError'); */

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_STATUS).send({ users }))
    .catch((err) => res.status(SERVER_ERROR_STATUS).send({ err: `Ошибка на сервере: ${err}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }, { runValidators: true })
    .then((user) => res.status(OK_STATUS).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({ err: 'Переданы некорректные данные в теле запроса' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ err: `Ошибка на сервере: ${err}` });
    });
};

module.exports.getUser = (req, res) => {
  User.find({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_STATUS).send({ err: 'Пользователь не найден' });
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({ err: 'Переданы некорректные данные в теле запроса' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ err: `Ошибка на сервере: ${err}` });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_STATUS).send({ err: 'Пользователь не найден' });
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({ err: 'Переданы некорректные данные в теле запроса' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ err: `Ошибка на сервере: ${err}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_STATUS).send({ err: 'Пользователь не найден' });
        return;
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({ err: 'Переданы некорректные данные в теле запроса' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ err: `Ошибка на сервере: ${err}` });
    });
};
