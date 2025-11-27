import express from 'express';
import {
  updateCard,
  getAllCards,
  getCardById,
  deleteCard,
  favoriteCard,
} from '../controllers/cardsController.js';

const router = express.Router();

router.get('/', getAllCards);
router.get('/:cardId', getCardById);
router.put('/:cardId', updateCard);
router.delete('/:cardId', deleteCard);
router.patch('/:cardId/favorite', favoriteCard);

export default router;