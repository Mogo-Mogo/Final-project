import express from 'express';
import {
  updateCard,
  getAllCards,
  getCardById,
  deleteCard,
} from '../controllers/cardsController.js';

const router = express.Router();

router.get('/', getAllCards);
router.get('/:cardId', getCardById);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);
router.patch('/:id', updateCard);

export default router;