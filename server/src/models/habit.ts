import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from 'typeorm';
import { User } from './user';
import { HabitCompletion } from './habit-completion';

@Entity('habits')
export class Habit {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', length: 255 })
	name!: string;

	@Column({ type: 'text', nullable: true })
	description!: string | null;

	@Column({ type: 'int', default: 7 })
	targetFrequency!: number;

	@Column('uuid')
	userId!: string;

	@ManyToOne(
		() => User,
		(user) => user.habits,
		{
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({ name: 'userId' })
	user!: User;

	@OneToMany(
		() => HabitCompletion,
		(completion) => completion.habit,
	)
	completions!: HabitCompletion[];

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
