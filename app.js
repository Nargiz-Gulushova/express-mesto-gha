require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const userRoutes = require('./routes/userRouter');
const cardRoutes = require('./routes/cardRouter');
const {
  STATUS_NOT_FOUND,
  NOT_FOUND_ERROR,
  LIMITER_CONFIG,
  PORT,
  MONGO_DB,
} = require('./utils/config');
const { login, createUser } = require('./controllers/userController');
const auth = require('./middlewares/auth');
const { validateUserSignup, validateUserSignin } = require('./utils/validations');

const app = express();
app.use(express.json());
app.use(cookieParser());

// защита сервера
app.use(helmet());
app.use(LIMITER_CONFIG);

mongoose.connect(MONGO_DB, { useNewUrlParser: true });

// авторизация
app.post('/signin', validateUserSignin, login);
app.post('/signup', validateUserSignup, createUser);

// основные роуты
app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.use('*', auth, (req, res) => res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR }));

// централизованный обработчик ошибок
app.use(errors());
app.use(require('./middlewares/errorsHandler'));

app.listen(PORT, () => console.log('Server started on', PORT));
