import express from 'express';
import {
  getLongTasks,
  getShortTasks,
  createTask,
  deleteTask,
  updateTask
} from '../controllers/tasksController.js';

const router = express.Router();

router.get('/long', getLongTasks);
router.get('/short', getShortTasks);
router.post('/', createTask);
router.delete('/:id', deleteTask);
router.put('/:id', updateTask);

export default router;