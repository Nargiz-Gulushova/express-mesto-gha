const { CastError, ValidationError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  CONFLICT_DUPLICATE_CODE,
  CONFLICT_DUPLICATE_ERROR,
  TOKEN_KEY,
} = require('../utils/config');
const ConflictDuplicate = require('../errors/ConflictDuplicate');
const BadRequest = require('../errors/BadRequest');

const { NODE_ENV, JWT_SECRET } = process.env;

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

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res
      .status(STATUS_SUCCESS_CREATED)
      .send({
        name, about, avatar, email,
      }))
    .catch((err) => {
      if (err.code === CONFLICT_DUPLICATE_CODE) {
        next(new ConflictDuplicate(CONFLICT_DUPLICATE_ERROR));
      } else if (err instanceof ValidationError) {
        next(new BadRequest(BAD_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  const getSecretKey = NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret';

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, getSecretKey, { expiresIn: '7d' });
      res
        .cookie(TOKEN_KEY, token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send({ email });
    })
    .catch(next);
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
  login,
};
