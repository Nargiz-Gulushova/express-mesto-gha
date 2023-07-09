require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const routes = require('./routes');
const {
  LIMITER_CONFIG,
  PORT,
  MONGO_DB,
} = require('./utils/config');

const app = express();
app.use(express.json());
app.use(cookieParser());

// защита сервера
app.use(helmet());
app.use(LIMITER_CONFIG);

// подключение к БД
mongoose.connect(MONGO_DB, { useNewUrlParser: true });

// роутинг приложения
app.use(routes);

// централизованная обработка ошибок
app.use(errors());
app.use(require('./middlewares/errorsHandler'));

app.listen(PORT, () => console.log('Server started on', PORT));
