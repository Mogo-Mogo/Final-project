import express from 'express';
import {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  deleteCard,
} from '../controllers/cardsController.js';

const router = express.Router();

router.get('/', getAllCards);