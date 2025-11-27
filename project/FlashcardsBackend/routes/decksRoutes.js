import express from 'express';
import {
  createDeck,
  getAllDecks,
  getDeckById,
  deleteDeck,
} from '../controllers/decksController.js';
import { getCardsByDeck } from '../controllers/cardsController.js';

const router = express.Router();

router.get('/', getAllDecks);
router.get('/:id', getDeckById);
router.post('/', createDeck);
router.delete('/:id', deleteDeck);
router.get('/:deckId/cards', getCardsByDeck);


export default router;