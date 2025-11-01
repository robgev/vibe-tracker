import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	Index,
} from 'typeorm';
import { Habit } from './habit';
import { HabitCompletion } from './habit-completion';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Index({ unique: true })
	@Column({ type: 'varchar', length: 255 })
	email!: string;

	@Column({ type: 'varchar', length: 255, select: false })
	passwordHash!: string;

	@OneToMany(
		() => Habit,
		(habit) => habit.user,
	)
	habits!: Habit[];

	@OneToMany(
		() => HabitCompletion,
		(completion) => completion.user,
	)
	completions!: HabitCompletion[];

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
