"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateHabit, useUpdateHabit } from "@/lib/hooks/use-habits";
import type { Habit } from "@/lib/api/types";

const habitFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  targetFrequency: z.coerce
    .number()
    .int()
    .min(1, "Must be at least 1")
    .max(7, "Must be at most 7"),
});

type HabitFormValues = z.infer<typeof habitFormSchema>;

interface HabitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit;
}

export function HabitFormDialog({
  open,
  onOpenChange,
  habit,
}: HabitFormDialogProps) {
  const isEditing = !!habit;
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit(habit?.id || "");

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      name: "",
      description: "",
      targetFrequency: 7,
    },
  });

  // Reset form when dialog opens with habit data
  useEffect(() => {
    if (habit && open) {
      form.reset({
        name: habit.name,
        description: habit.description || "",
        targetFrequency: habit.targetFrequency,
      });
    } else if (!habit && open) {
      form.reset({
        name: "",
        description: "",
        targetFrequency: 7,
      });
    }
  }, [habit, open, form]);

  const onSubmit = (values: HabitFormValues) => {
    const mutation = isEditing ? updateHabit : createHabit;

    mutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Habit" : "Create New Habit"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your habit details below."
              : "Add a new habit to track. Set a target frequency for how many days per week you want to complete it."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Morning Exercise"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 30 minutes of cardio or strength training"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>
                    Add details about what this habit involves.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Frequency (days per week)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "day" : "days"} per week
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How many days per week do you want to complete this habit?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createHabit.isPending || updateHabit.isPending}
              >
                {createHabit.isPending || updateHabit.isPending
                  ? "Saving..."
                  : isEditing
                    ? "Update Habit"
                    : "Create Habit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
