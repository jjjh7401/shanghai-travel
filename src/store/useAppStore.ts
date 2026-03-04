import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CNY_TO_KRW_RATE } from "@/data/constants";

interface AppSettings {
  exchangeRate: number;
  showChineseNames: boolean;
  notificationsEnabled: boolean;
}

interface AppState {
  settings: AppSettings;
  updateExchangeRate: (rate: number) => void;
  toggleChineseNames: () => void;
  toggleNotifications: () => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  exchangeRate: DEFAULT_CNY_TO_KRW_RATE,
  showChineseNames: true,
  notificationsEnabled: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateExchangeRate: (rate: number) => {
        if (rate > 0) {
          set((state) => ({
            settings: { ...state.settings, exchangeRate: rate },
          }));
        }
      },

      toggleChineseNames: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            showChineseNames: !state.settings.showChineseNames,
          },
        }));
      },

      toggleNotifications: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            notificationsEnabled: !state.settings.notificationsEnabled,
          },
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },
    }),
    {
      name: "shanghai-travel-settings",
    }
  )
);
