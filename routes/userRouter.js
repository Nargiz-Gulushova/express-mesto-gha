const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  patchUserData,
  patchUserAvatar,
} = require('../controllers/userController');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', patchUserData);
userRouter.patch('/me/avatar', patchUserAvatar);

module.exports = userRouter;
