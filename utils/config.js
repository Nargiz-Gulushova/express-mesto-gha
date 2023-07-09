const rateLimit = require('express-rate-limit');

// конфигурация лимитера запросов
const LIMITER_CONFIG = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// статусы ошибок
const STATUS_SUCCESS_CREATED = 201;
const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_INTERNAL_SERVER_ERROR = 500;

// код дубликата от монго
const CONFLICT_DUPLICATE_CODE = 11000;

// тексты ошибок
const SERVER_ERROR = 'Что-то пошло не так.';
const NOT_FOUND_ERROR = 'Запрошенные данные не найдены.';
const BAD_REQUEST_ERROR = 'Переданы некорректные данные ';
const NOT_VALID_ID_ERROR = 'NotValidId';
const UNAUTH_ERROR = 'Неправильные почта или пароль.';
const CONFLICT_DUPLICATE_ERROR = 'Этот email уже зарегистрирован.';
const VALIDATION_URL_ERROR = 'Передана некорректная ссылка.';
const VALIDATION_EMAIL_ERROR = 'Указан некорректный email.';

// строка под токен
const TOKEN_KEY = 'token';

// переменные окружения или стандартные значения
const JWT_SECRET = process.env.JWT_SECRET || 'super-strong-secret';
const PORT = process.env.PORT || 3000;
const MONGO_DB = process.env.MONGO_DB || 'mongodb://127.0.0.1:27017/mestodb';

module.exports = {
  STATUS_SUCCESS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  SERVER_ERROR,
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  NOT_VALID_ID_ERROR,
  UNAUTH_ERROR,
  CONFLICT_DUPLICATE_ERROR,
  VALIDATION_URL_ERROR,
  VALIDATION_EMAIL_ERROR,
  CONFLICT_DUPLICATE_CODE,
  TOKEN_KEY,
  LIMITER_CONFIG,
  JWT_SECRET,
  PORT,
  MONGO_DB,
};
