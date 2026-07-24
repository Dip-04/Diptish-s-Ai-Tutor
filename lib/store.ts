"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  focusMinutes: number;
  addFocus: (minutes: number) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      focusMinutes: 0,
      addFocus: (minutes) => set((state) => ({ focusMinutes: state.focusMinutes + minutes }))
    }),
    { name: "diptishai-progress" }
  )
);
