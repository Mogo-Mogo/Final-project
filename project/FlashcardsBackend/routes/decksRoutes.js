import express from 'express';
import {
  createDeck,
  getAllDecks,
  getDeckById,
  deleteDeck,
} from '../controllers/decksController.js';

const router = express.Router();

router.get('/', getAllDecks);
router.get('/:id', getDeckById);
router.post('/', createDeck);
router.delete('/:id', deleteDeck);

export default router;