"use client";

import { Plus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabits } from "@/lib/hooks/use-habits";
import type { Habit } from "@/lib/api/types";
import { format } from "date-fns";

export default function HabitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed-today">(
    "all",
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  // Fetch habits based on filter
  const { data, isLoading, error } = useHabits(
    filterStatus === "completed-today"
      ? { status: "completed-today" }
      : undefined,
  );

  // Client-side search filtering
  const filteredHabits = useMemo(() => {
    if (!data?.habits) return [];

    if (!searchQuery) return data.habits;

    const query = searchQuery.toLowerCase();
    return data.habits.filter(
      (habit) =>
        habit.name.toLowerCase().includes(query) ||
        habit.description?.toLowerCase().includes(query),
    );
  }, [data?.habits, searchQuery]);

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleCloseEditDialog = () => {
    setEditingHabit(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            My Habits
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Track your daily habits and build better routines
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Habit
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(value: "all" | "completed-today") =>
            setFilterStatus(value)
          }
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Habits</SelectItem>
            <SelectItem value="completed-today">Completed Today</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Habits List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-6 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load habits. Please try again.
          </p>
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Plus className="h-10 w-10 text-zinc-600 dark:text-zinc-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
              {searchQuery || filterStatus !== "all"
                ? "No habits found"
                : "No habits yet"}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filters."
                : "Get started by creating your first habit to track."}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Habit
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={() => handleEdit(habit)}
              />
            ))}
          </div>
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Showing {filteredHabits.length} of {data?.habits.length || 0} habits
          </div>
        </>
      )}

      {/* Create Habit Dialog */}
      <HabitFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Edit Habit Dialog */}
      <HabitFormDialog
        open={!!editingHabit}
        onOpenChange={handleCloseEditDialog}
        habit={editingHabit}
      />
    </div>
  );
}
