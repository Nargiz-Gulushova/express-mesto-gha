const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const PORT = process.env.PORT || 3000;
const MONGO_DB = process.env.MONGO_DB || 'mongodb://127.0.0.1:27017/mestodb';

const userRoutes = require('./routes/userRouter');
const cardRoutes = require('./routes/cardRouter');
const { STATUS_NOT_FOUND, NOT_FOUND_ERROR, LIMITER_CONFIG } = require('./utils/config');
const { login, createUser } = require('./controllers/userController');

const app = express();
app.use(express.json());

// защита сервера
app.use(helmet());
app.use(LIMITER_CONFIG);

mongoose.connect(MONGO_DB, { useNewUrlParser: true });

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64a48d8704f9fbd6cee5a585', // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

// авторизация
app.post('/signin', login);
app.post('/signup', createUser);

// основные роуты
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR }));

// централизованный обработчик ошибок
app.use(require('./middlewares/errorsHandler'));

app.listen(PORT, () => console.log('Server started on', PORT));
