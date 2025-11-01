import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './user';
import { Habit } from './habit';

@Entity('habit_completions')
export class HabitCompletion {
	@PrimaryColumn('uuid')
	habitId!: string;

	@PrimaryColumn('uuid')
	userId!: string;

	@PrimaryColumn({ type: 'date' })
	date!: string;

	@ManyToOne(
		() => Habit,
		(habit) => habit.completions,
		{
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({ name: 'habitId' })
	habit!: Habit;

	@ManyToOne(
		() => User,
		(user) => user.completions,
		{
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({ name: 'userId' })
	user!: User;
}
