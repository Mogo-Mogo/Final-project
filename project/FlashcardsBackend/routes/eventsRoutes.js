import express from 'express';
import {
  getEvents,
  getEventById,
  getUserEvents,
  getPlanEvents,
  createEvent,
  deleteEvent,
  deletePlanEvents
} from '../controllers/eventsController.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/user', getUserEvents);
router.get('/plan', getPlanEvents);
router.get('/:id', getEventById);
router.delete('/plan', deletePlanEvents);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);

export default router;