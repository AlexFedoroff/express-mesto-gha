const Card = require('../models/card');
const {
  OK_STATUS, NOT_FOUND_STATUS, BAD_REQUEST_STATUS, SERVER_ERROR_STATUS,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(SERVER_ERROR_STATUS).send({ message: `Ошибка на сервере: ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name, link, owner: req.user._id, runValidators: true,
  })
    .then((card) => res.status(OK_STATUS).send({ card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({ message: `Переданы некорректные данные в теле запроса. Подробнее: ${err}` });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: `Ошибка на сервере: ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Карточка не найдена!' });
        return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({ message: `Переданы некорректные данные в параметре запроса. Подробнее: ${err}` });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: `Ошибка на сервере: ${err}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Карточка с таким ID не найдена' });
        return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'Некорректный ID карточки' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: `Ошибка на сервере: ${err}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Карточка с таким ID не найдена' });
        return;
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'Некорректный ID карточки' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: `Ошибка на сервере: ${err}` });
    });
};
