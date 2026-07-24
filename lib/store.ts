"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialTasks, type Task } from "./data";

type AppState = {
  tasks: Task[];
  focusMinutes: number;
  toggleTask: (id: string) => void;
  resetDay: () => void;
  addFocus: (minutes: number) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      focusMinutes: 65,
      toggleTask: (id) => set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task) })),
      resetDay: () => set({ tasks: initialTasks }),
      addFocus: (minutes) => set((state) => ({ focusMinutes: state.focusMinutes + minutes }))
    }),
    { name: "diptishai-progress" }
  )
);
