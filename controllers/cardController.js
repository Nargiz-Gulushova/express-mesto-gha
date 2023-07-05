const { CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/cardSchema');
const {
  STATUS_SUCCESS_CREATED,
  STATUS_BAD_REQUEST,
  BAD_REQUEST_ERROR,
  STATUS_INTERNAL_SERVER_ERROR,
  SERVER_ERROR,
  NOT_VALID_ID_ERROR,
  STATUS_NOT_FOUND,
  NOT_FOUND_ERROR,
} = require('../utils/config');

function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_SUCCESS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(STATUS_BAD_REQUEST).send({ message: BAD_REQUEST_ERROR + err.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
      }
    });
}

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
    });
}

function deleteCardById(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error(NOT_VALID_ID_ERROR))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === NOT_VALID_ID_ERROR) {
        res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR });
      } else if (err instanceof CastError) {
        res.status(STATUS_BAD_REQUEST).send({ message: BAD_REQUEST_ERROR + err.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
      }
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error(NOT_VALID_ID_ERROR))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === NOT_VALID_ID_ERROR) {
        res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR });
      } else if (err instanceof CastError) {
        res.status(STATUS_BAD_REQUEST).send({ message: BAD_REQUEST_ERROR + err.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
      }
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error(NOT_VALID_ID_ERROR))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === NOT_VALID_ID_ERROR) {
        res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR });
      } else if (err instanceof CastError) {
        res.status(STATUS_BAD_REQUEST).send({ message: BAD_REQUEST_ERROR + err.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
      }
    });
}

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
