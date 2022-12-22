const Card = require('../models/card');
const NotFoundError = require('../utils/notFound');
const BadRequestError = require('../utils/badRequest');
const ServerError = require('../utils/serverError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(new ServerError(`Произошла ошибка на сервере: ${err.message}`));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в теле запроса'));
        return;
      }
      next(new ServerError(`Произошла ошибка на сервере: ${err.message}`));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена!'));
      }
      card.remove().then(res.send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в параметре запроса'));
        return;
      }
      next(new ServerError(`Произошла ошибка на сервере: ${err.message}`));
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный id карточки!'));
        return;
      }
      next(new ServerError(`Произошла ошибка на сервере: ${err.message}`));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный ид карточки!'));
        return;
      }
      next(new ServerError(`Произошла ошибка на сервере: ${err.message}`));
    });
};
