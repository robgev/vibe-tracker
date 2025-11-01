// User types
export interface User {
  id: string;
  email: string;
}

// Habit types
export interface Habit {
  id: string;
  name: string;
  description: string | null;
  targetFrequency: number; // 1-7 days per week
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateHabitInput {
  name: string;
  description?: string;
  targetFrequency?: number; // 1-7, defaults to 7
}

export interface UpdateHabitInput {
  name?: string;
  description?: string;
  targetFrequency?: number;
}

// Habit Completion types
export interface HabitCompletion {
  habitId: string;
  userId: string;
  date: string; // "YYYY-MM-DD"
}

export interface WeekDay {
  date: string; // "YYYY-MM-DD"
  completed: boolean;
}

// API Response types
export interface HabitsResponse {
  habits: Habit[];
}

export interface HabitResponse {
  habit: Habit;
}

export interface CreateHabitResponse {
  message: string;
  habit: Habit;
}

export interface UpdateHabitResponse {
  message: string;
  habit: Habit;
}

export interface DeleteHabitResponse {
  message: string;
}

export interface CompleteHabitResponse {
  message: string;
  completion?: HabitCompletion;
}

export interface WeekViewResponse {
  week: WeekDay[];
}

// Query parameters
export interface ListHabitsParams {
  search?: string;
  status?: "completed-today";
}

export interface CompletionActionInput {
  date?: string; // "YYYY-MM-DD", defaults to today
}

// Streak calculation types
export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  longestStreak: number;
}

// Statistics types
export interface HabitStats {
  habitId: string;
  habitName: string;
  currentStreak: number;
  bestStreak: number;
  longestStreak: number;
  completionRate: number; // percentage
  totalCompletions: number;
  targetFrequency: number;
}
