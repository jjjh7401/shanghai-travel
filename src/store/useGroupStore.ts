import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GroupNumber } from "@/data/groupSchedules";

interface GroupState {
  selectedGroup: GroupNumber | null;
  hasSelectedGroup: boolean;
}

interface GroupActions {
  setGroup: (group: GroupNumber) => void;
  resetGroup: () => void;
}

export const useGroupStore = create<GroupState & GroupActions>()(
  persist(
    (set) => ({
      selectedGroup: null,
      hasSelectedGroup: false,

      setGroup: (group) => {
        set({ selectedGroup: group, hasSelectedGroup: true });
      },

      resetGroup: () => {
        set({ selectedGroup: null, hasSelectedGroup: false });
      },
    }),
    {
      name: "shanghai-group-selection",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
