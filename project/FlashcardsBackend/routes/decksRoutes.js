import express from 'express';
import {
  createDeck,
  getAllDecks,
  getDeckById,
  deleteDeck,
} from '../controllers/decksController.js';
import { getCardsByDeck, createCard } from '../controllers/cardsController.js';

const router = express.Router();

router.get('/', getAllDecks);
router.get('/:id', getDeckById);
router.post('/', createDeck);
router.delete('/:id', deleteDeck);
router.get('/:deckId/cards', getCardsByDeck);
router.post('/:deckId/cards', createCard);

export default router;