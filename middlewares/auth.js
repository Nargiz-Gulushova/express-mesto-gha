const jwt = require('jsonwebtoken');
const { JWT_SECRET, UNAUTH_ERROR } = require('../utils/config');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { token } = req.cookies;

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new Unauthorized(UNAUTH_ERROR));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
