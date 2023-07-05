const cardRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cardController');

cardRouter.post('/', createCard);
cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
