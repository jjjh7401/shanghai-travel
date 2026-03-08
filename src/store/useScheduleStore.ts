import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { venues as allVenues, getVenueById } from "@/data/venues";
import { getGroupDayVenueIds } from "@/data/groupSchedules";
import type { GroupNumber } from "@/data/groupSchedules";
import type { Coordinates } from "@/types/venue";

export type ScheduleDay = 1 | 2 | 3 | "food";

interface ScheduleMap {
  1: string[];
  2: string[];
  3: string[];
  food: string[];
}

interface ScheduleState {
  schedules: ScheduleMap;
  // 현재 활성 조
  activeGroup: GroupNumber | null;
  // 조별 커스텀 일정 저장소 (localStorage에 함께 persist)
  groupScheduleMap: Partial<Record<GroupNumber, ScheduleMap>>;
}

interface ScheduleActions {
  addVenueToDay: (venueId: string, day: ScheduleDay) => void;
  removeVenueFromDay: (venueId: string, day: ScheduleDay) => void;
  moveVenueUp: (venueId: string, day: ScheduleDay) => void;
  moveVenueDown: (venueId: string, day: ScheduleDay) => void;
  reorderByDistance: (day: ScheduleDay) => void;
  resetToDefault: () => void;
  initializeForGroup: (group: GroupNumber) => void;
}

function buildDefaultSchedules(): ScheduleMap {
  const map: ScheduleMap = { 1: [], 2: [], 3: [], food: [] };
  const sorted = [...allVenues].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  for (const v of sorted) {
    map[v.dayNumber].push(v.id);
  }
  return map;
}

function buildGroupSchedules(group: GroupNumber): ScheduleMap {
  return {
    1: getGroupDayVenueIds(group, 1),
    2: getGroupDayVenueIds(group, 2),
    3: getGroupDayVenueIds(group, 3),
    food: [],
  };
}

// Haversine 공식으로 두 좌표 간 거리(km) 계산
function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const c =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
}

// 최근접 이웃 알고리즘으로 장소 ID 배열 정렬 (좌표 없는 장소는 맨 뒤로)
function sortByNearestNeighbor(venueIds: string[]): string[] {
  if (venueIds.length <= 2) return venueIds;

  const withCoords = venueIds.map((id) => ({
    id,
    coords: getVenueById(id)?.coordinates ?? null,
  }));

  const valid = withCoords.filter(
    (v): v is { id: string; coords: Coordinates } => v.coords !== null
  );
  const invalid = withCoords.filter((v) => v.coords === null).map((v) => v.id);

  if (valid.length <= 2) return venueIds;

  const unvisited = [...valid];
  const result: typeof valid = [unvisited.splice(0, 1)[0]];

  while (unvisited.length > 0) {
    const last = result[result.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = haversineKm(last.coords, unvisited[i].coords);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    result.push(...unvisited.splice(nearestIdx, 1));
  }

  return [...result.map((v) => v.id), ...invalid];
}

export const useScheduleStore = create<ScheduleState & ScheduleActions>()(
  persist(
    (set) => ({
      schedules: buildDefaultSchedules(),
      activeGroup: null,
      groupScheduleMap: {},

      addVenueToDay: (venueId, day) => {
        set((state) => {
          if (state.schedules[day].includes(venueId)) return state;
          const newSchedules = {
            ...state.schedules,
            [day]: [...state.schedules[day], venueId],
          };
          return {
            schedules: newSchedules,
            groupScheduleMap:
              state.activeGroup !== null
                ? { ...state.groupScheduleMap, [state.activeGroup]: newSchedules }
                : state.groupScheduleMap,
          };
        });
      },

      removeVenueFromDay: (venueId, day) => {
        set((state) => {
          const newSchedules = {
            ...state.schedules,
            [day]: state.schedules[day].filter((id) => id !== venueId),
          };
          return {
            schedules: newSchedules,
            groupScheduleMap:
              state.activeGroup !== null
                ? { ...state.groupScheduleMap, [state.activeGroup]: newSchedules }
                : state.groupScheduleMap,
          };
        });
      },

      moveVenueUp: (venueId, day) => {
        set((state) => {
          const list = [...state.schedules[day]];
          const idx = list.indexOf(venueId);
          if (idx <= 0) return state;
          [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
          const newSchedules = { ...state.schedules, [day]: list };
          return {
            schedules: newSchedules,
            groupScheduleMap:
              state.activeGroup !== null
                ? { ...state.groupScheduleMap, [state.activeGroup]: newSchedules }
                : state.groupScheduleMap,
          };
        });
      },

      moveVenueDown: (venueId, day) => {
        set((state) => {
          const list = [...state.schedules[day]];
          const idx = list.indexOf(venueId);
          if (idx < 0 || idx >= list.length - 1) return state;
          [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
          const newSchedules = { ...state.schedules, [day]: list };
          return {
            schedules: newSchedules,
            groupScheduleMap:
              state.activeGroup !== null
                ? { ...state.groupScheduleMap, [state.activeGroup]: newSchedules }
                : state.groupScheduleMap,
          };
        });
      },

      reorderByDistance: (day) => {
        set((state) => {
          if (day === "food") return state;
          const reordered = sortByNearestNeighbor(
            state.schedules[day as 1 | 2 | 3]
          );
          const newSchedules = { ...state.schedules, [day]: reordered };
          return {
            schedules: newSchedules,
            groupScheduleMap:
              state.activeGroup !== null
                ? { ...state.groupScheduleMap, [state.activeGroup]: newSchedules }
                : state.groupScheduleMap,
          };
        });
      },

      resetToDefault: () => {
        const defaultSchedules = buildDefaultSchedules();
        set((state) => ({
          schedules: defaultSchedules,
          groupScheduleMap:
            state.activeGroup !== null
              ? { ...state.groupScheduleMap, [state.activeGroup]: defaultSchedules }
              : state.groupScheduleMap,
        }));
      },

      initializeForGroup: (group) => {
        set((state) => {
          const saved = state.groupScheduleMap[group];
          const schedules = saved ?? buildGroupSchedules(group);
          return {
            schedules,
            activeGroup: group,
            groupScheduleMap: saved
              ? state.groupScheduleMap
              : { ...state.groupScheduleMap, [group]: schedules },
          };
        });
      },
    }),
    {
      name: "shanghai-schedule",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
