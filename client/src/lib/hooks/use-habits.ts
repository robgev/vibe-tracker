"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  completeHabit,
  createHabit,
  deleteHabit,
  getHabit,
  getWeekView,
  listHabits,
  uncompleteHabit,
  updateHabit,
} from "../api/habits";
import type {
  CompletionActionInput,
  CreateHabitInput,
  ListHabitsParams,
  UpdateHabitInput,
} from "../api/types";

// Query keys
export const habitKeys = {
  all: ["habits"] as const,
  lists: () => [...habitKeys.all, "list"] as const,
  list: (params?: ListHabitsParams) =>
    [...habitKeys.lists(), params] as const,
  details: () => [...habitKeys.all, "detail"] as const,
  detail: (id: string) => [...habitKeys.details(), id] as const,
  week: (id: string) => [...habitKeys.detail(id), "week"] as const,
};

// List habits query
export function useHabits(params?: ListHabitsParams) {
  return useQuery({
    queryKey: habitKeys.list(params),
    queryFn: () => listHabits(params),
  });
}

// Get single habit query
export function useHabit(id: string) {
  return useQuery({
    queryKey: habitKeys.detail(id),
    queryFn: () => getHabit(id),
    enabled: !!id,
  });
}

// Get week view query
export function useWeekView(habitId: string) {
  return useQuery({
    queryKey: habitKeys.week(habitId),
    queryFn: () => getWeekView(habitId),
    enabled: !!habitId,
  });
}

// Create habit mutation
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateHabitInput) => createHabit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      toast.success("Habit created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create habit");
    },
  });
}

// Update habit mutation
export function useUpdateHabit(habitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateHabitInput) => updateHabit(habitId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(habitId) });
      toast.success("Habit updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update habit");
    },
  });
}

// Delete habit mutation
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: string) => deleteHabit(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      toast.success("Habit deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete habit");
    },
  });
}

// Complete habit mutation
export function useCompleteHabit(habitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input?: CompletionActionInput) => completeHabit(habitId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: habitKeys.week(habitId) });
      toast.success("Habit marked as complete");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark habit as complete");
    },
  });
}

// Uncomplete habit mutation
export function useUncompleteHabit(habitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input?: CompletionActionInput) =>
      uncompleteHabit(habitId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: habitKeys.week(habitId) });
      toast.success("Completion removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove completion");
    },
  });
}

// Toggle completion mutation (detects if completed and toggles)
export function useToggleCompletion(habitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      isCompleted,
    }: {
      date?: string;
      isCompleted: boolean;
    }) => {
      if (isCompleted) {
        return uncompleteHabit(habitId, { date });
      }
      return completeHabit(habitId, { date });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: habitKeys.week(habitId) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to toggle completion");
    },
  });
}
