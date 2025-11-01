import { apiClient } from "./client";
import type {
  CompleteHabitResponse,
  CompletionActionInput,
  CreateHabitInput,
  CreateHabitResponse,
  DeleteHabitResponse,
  HabitResponse,
  HabitsResponse,
  ListHabitsParams,
  UpdateHabitInput,
  UpdateHabitResponse,
  WeekViewResponse,
} from "./types";

// Habits CRUD
export async function listHabits(
  params?: ListHabitsParams,
): Promise<HabitsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.search) {
    searchParams.set("search", params.search);
  }
  if (params?.status) {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();
  const endpoint = query ? `/api/habits?${query}` : "/api/habits";

  return apiClient<HabitsResponse>(endpoint);
}

export async function getHabit(id: string): Promise<HabitResponse> {
  return apiClient<HabitResponse>(`/api/habits/${id}`);
}

export async function createHabit(
  input: CreateHabitInput,
): Promise<CreateHabitResponse> {
  return apiClient<CreateHabitResponse>("/api/habits", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateHabit(
  id: string,
  input: UpdateHabitInput,
): Promise<UpdateHabitResponse> {
  return apiClient<UpdateHabitResponse>(`/api/habits/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteHabit(id: string): Promise<DeleteHabitResponse> {
  return apiClient<DeleteHabitResponse>(`/api/habits/${id}`, {
    method: "DELETE",
  });
}

// Habit Completions
export async function completeHabit(
  habitId: string,
  input?: CompletionActionInput,
): Promise<CompleteHabitResponse> {
  return apiClient<CompleteHabitResponse>(`/api/habits/${habitId}/complete`, {
    method: "POST",
    body: JSON.stringify(input || {}),
  });
}

export async function uncompleteHabit(
  habitId: string,
  input?: CompletionActionInput,
): Promise<CompleteHabitResponse> {
  return apiClient<CompleteHabitResponse>(`/api/habits/${habitId}/complete`, {
    method: "DELETE",
    body: JSON.stringify(input || {}),
  });
}

export async function getWeekView(habitId: string): Promise<WeekViewResponse> {
  return apiClient<WeekViewResponse>(`/api/habits/${habitId}/week`);
}
