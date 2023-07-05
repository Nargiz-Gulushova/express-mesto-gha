const { CastError, ValidationError } = require('mongoose').Error;
const User = require('../models/userSchema');
const {
  STATUS_INTERNAL_SERVER_ERROR,
  SERVER_ERROR,
  NOT_VALID_ID_ERROR,
  STATUS_NOT_FOUND,
  NOT_FOUND_ERROR,
  STATUS_BAD_REQUEST,
  BAD_REQUEST_ERROR,
  STATUS_SUCCESS_CREATED,
} = require('../utils/config');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
    });
}

function getUserById(req, res) {
  User.findById(req.params.id)
    .orFail(new Error(NOT_VALID_ID_ERROR))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === NOT_VALID_ID_ERROR) {
        res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR });
      } else if (err instanceof CastError) {
        res.status(STATUS_BAD_REQUEST).send({ message: BAD_REQUEST_ERROR });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
      }
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_SUCCESS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(STATUS_BAD_REQUEST).send({ message: BAD_REQUEST_ERROR + err.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
      }
    });
}

function patchUserData(req, res) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error(NOT_VALID_ID_ERROR))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === NOT_VALID_ID_ERROR) {
        res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR });
      } else if (err instanceof ValidationError || err instanceof CastError) {
        res.status(STATUS_BAD_REQUEST).send({ message: BAD_REQUEST_ERROR + err.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
      }
    });
}

function patchUserAvatar(req, res) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error(NOT_VALID_ID_ERROR))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === NOT_VALID_ID_ERROR) {
        res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR });
      } else if (err instanceof ValidationError || err instanceof CastError) {
        res.status(STATUS_BAD_REQUEST).send({ message: BAD_REQUEST_ERROR + err.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: SERVER_ERROR + err.message });
      }
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  patchUserData,
  patchUserAvatar,
};
