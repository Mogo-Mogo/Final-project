import express from 'express';
import {
  createCard,
  getAllCards,
  getCardById,
  deleteCard,
} from '../controllers/cardsController.js';

const router = express.Router();

router.get('/', getAllCards);
router.get('/:id', getCardById);
router.put('/:id', createCard);
router.delete('/:id', deleteCard);

export default router;