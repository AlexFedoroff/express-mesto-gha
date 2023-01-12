const BadRequestError = require('../utils/bad-request-error');
const NotFoundError = require('../utils/not-found-error');
const ForbiddenError = require('../utils/forbidden-error');

const Card = require('../models/card');
const { OK_STATUS } = require('../utils/constants');

const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name, link, owner: req.user._id, runValidators: true,
  })
    .then((card) => res.status(OK_STATUS).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      if (!card.owner._id.equals(req.user._id)) {
        throw new ForbiddenError('У вас нет прав на удаление этой карточки');
      } else {
        res.status(OK_STATUS).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const handleLikeCard = (method, req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [method]: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(new NotFoundError('Карточка с таким id не найдена'));
    })
    .then((card) => {
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  handleLikeCard('$addToSet', req, res, next);
};

const dislikeCard = (req, res, next) => {
  handleLikeCard('$pull', req, res, next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
