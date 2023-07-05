const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRouter');
const cardRoutes = require('./routes/cardRouter');
const { STATUS_NOT_FOUND, NOT_FOUND_ERROR } = require('./utils/config');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true });

app.use((req, res, next) => {
  req.user = {
    _id: '64a48d8704f9fbd6cee5a585', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR }));

app.listen(PORT, () => console.log('Server started on', PORT));
