const router = require('express').Router();
const auth = require('../middlewares/auth');
const { STATUS_NOT_FOUND, NOT_FOUND_ERROR } = require('../utils/config');

// роуты авторизации
router.use(require('./authRouter'));

// все ниже под защитой миддлварины авторизации
// роуты карточек
router.use('/cards', auth, require('./cardRouter'));
// роуты пользователей
router.use('/users', auth, require('./userRouter'));
// отлов 404
router.use('*', auth, (req, res) => res.status(STATUS_NOT_FOUND).send({ message: NOT_FOUND_ERROR }));

module.exports = router;
