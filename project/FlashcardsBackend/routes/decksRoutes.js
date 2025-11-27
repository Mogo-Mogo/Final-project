import express from 'express';
import {
  createDeck,
  getAllDecks,
  getDeckById,
  deleteDeck,
} from '../controllers/decksController.js';

const router = express.Router();

router.get('/', getAllCards);
router.get('/:id', getCardById);
router.post('/', createCard);
router.delete('/:id', deleteCard);

export default router;