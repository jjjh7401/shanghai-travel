import { create } from "zustand";
import type { VenueCategory } from "@/types/venue";

// 0 = 전체 보기, 1/2/3 = 해당 날짜
const VALID_DAYS = [0, 1, 2, 3] as const;
type DayNumber = (typeof VALID_DAYS)[number];

interface FilterState {
  selectedDay: DayNumber;
  selectedCategories: VenueCategory[];
  showNightviewOnly: boolean;
}

interface FilterActions {
  setSelectedDay: (day: number) => void;
  toggleCategory: (category: VenueCategory) => void;
  setShowNightviewOnly: (show: boolean) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  selectedDay: 0,
  selectedCategories: [],
  showNightviewOnly: false,
};

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,

  setSelectedDay: (day: number) => {
    // 유효하지 않은 날짜는 무시
    if (!VALID_DAYS.includes(day as DayNumber)) {
      return;
    }
    set({ selectedDay: day as DayNumber });
  },

  toggleCategory: (category: VenueCategory) => {
    set((state) => {
      const isSelected = state.selectedCategories.includes(category);
      if (isSelected) {
        return {
          selectedCategories: state.selectedCategories.filter(
            (c) => c !== category
          ),
        };
      } else {
        return {
          selectedCategories: [...state.selectedCategories, category],
        };
      }
    });
  },

  setShowNightviewOnly: (show: boolean) => {
    set({ showNightviewOnly: show });
  },

  resetFilters: () => {
    set(initialState);
  },
}));
