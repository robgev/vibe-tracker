import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorizeHabitOwner } from '../middleware/authorize';
import {
	listHabits,
	createHabit,
	updateHabit,
	deleteHabit,
} from '../controllers/habits';
import {
	completeHabit,
	uncompleteHabit,
	getWeekView,
	getHabitStatistics,
} from '../controllers/completions';

const router = Router();

router
	.use(authenticate)
	.get('/', listHabits)
	.post('/', createHabit)
	.get('/:id', authorizeHabitOwner, (req, res) => res.json({ habit: res.locals.habit }))
	.put('/:id', authorizeHabitOwner, updateHabit)
	.delete('/:id', authorizeHabitOwner, deleteHabit)
	.get('/:id/week', authorizeHabitOwner, getWeekView)
	.get('/:id/stats', authorizeHabitOwner, getHabitStatistics)
	.post('/:id/complete', authorizeHabitOwner, completeHabit)
	.delete('/:id/complete', authorizeHabitOwner, uncompleteHabit);

export default router;
