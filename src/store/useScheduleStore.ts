import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { venues as allVenues } from "@/data/venues";

export type ScheduleDay = 1 | 2 | 3 | "food";

interface ScheduleMap {
  1: string[];
  2: string[];
  3: string[];
  food: string[];
}

interface ScheduleState {
  schedules: ScheduleMap;
}

interface ScheduleActions {
  addVenueToDay: (venueId: string, day: ScheduleDay) => void;
  removeVenueFromDay: (venueId: string, day: ScheduleDay) => void;
  moveVenueUp: (venueId: string, day: ScheduleDay) => void;
  moveVenueDown: (venueId: string, day: ScheduleDay) => void;
  resetToDefault: () => void;
}

function buildDefaultSchedules(): ScheduleMap {
  const map: ScheduleMap = { 1: [], 2: [], 3: [], food: [] };
  const sorted = [...allVenues].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  for (const v of sorted) {
    map[v.dayNumber].push(v.id);
  }
  return map;
}

export const useScheduleStore = create<ScheduleState & ScheduleActions>()(
  persist(
    (set) => ({
      schedules: buildDefaultSchedules(),

      addVenueToDay: (venueId, day) => {
        set((state) => {
          if (state.schedules[day].includes(venueId)) return state;
          return {
            schedules: {
              ...state.schedules,
              [day]: [...state.schedules[day], venueId],
            },
          };
        });
      },

      removeVenueFromDay: (venueId, day) => {
        set((state) => ({
          schedules: {
            ...state.schedules,
            [day]: state.schedules[day].filter((id) => id !== venueId),
          },
        }));
      },

      moveVenueUp: (venueId, day) => {
        set((state) => {
          const list = [...state.schedules[day]];
          const idx = list.indexOf(venueId);
          if (idx <= 0) return state;
          [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
          return { schedules: { ...state.schedules, [day]: list } };
        });
      },

      moveVenueDown: (venueId, day) => {
        set((state) => {
          const list = [...state.schedules[day]];
          const idx = list.indexOf(venueId);
          if (idx < 0 || idx >= list.length - 1) return state;
          [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
          return { schedules: { ...state.schedules, [day]: list } };
        });
      },

      resetToDefault: () => {
        set({ schedules: buildDefaultSchedules() });
      },
    }),
    {
      name: "shanghai-schedule",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
