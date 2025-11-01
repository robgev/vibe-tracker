"use client";

import { Calendar, CheckCircle2, Edit, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCompleteHabit, useDeleteHabit } from "@/lib/hooks/use-habits";
import type { Habit } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  isCompletedToday?: boolean;
  onEdit?: () => void;
}

export function HabitCard({
  habit,
  isCompletedToday = false,
  onEdit,
}: HabitCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const completeHabit = useCompleteHabit(habit.id);
  const deleteHabit = useDeleteHabit();

  const handleQuickComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCompletedToday) {
      completeHabit.mutate();
    }
  };

  const handleDelete = () => {
    deleteHabit.mutate(habit.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
              {habit.name}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/habits/${habit.id}/week`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Week View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {habit.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {habit.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {habit.targetFrequency}x / week
              </Badge>
              {isCompletedToday && (
                <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Completed Today
                </Badge>
              )}
            </div>

            <Button
              size="sm"
              variant={isCompletedToday ? "secondary" : "default"}
              onClick={handleQuickComplete}
              disabled={isCompletedToday || completeHabit.isPending}
              className={cn(
                "gap-2",
                isCompletedToday &&
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isCompletedToday ? "Done" : "Complete"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Habit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{habit.name}"? This action cannot
              be undone and will remove all completion history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteHabit.isPending}
            >
              {deleteHabit.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
