import { describe, it, expect, beforeEach, vi } from "vitest";
import { useScheduleStore } from "../useScheduleStore";

// Zustand persist 미들웨어 bypass - 테스트에서는 localStorage 없이 in-memory로 동작
vi.mock("zustand/middleware", async (importOriginal) => {
  const actual = await importOriginal<typeof import("zustand/middleware")>();
  return {
    ...actual,
    // persist를 no-op으로 교체하여 localStorage 의존성 제거
    persist:
      (fn: Parameters<typeof actual.persist>[0]) =>
      (...args: unknown[]) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fn as (...a: unknown[]) => unknown)(...args),
  };
});

describe("useScheduleStore", () => {
  beforeEach(() => {
    useScheduleStore.getState().resetToDefault();
  });

  describe("초기 상태", () => {
    it("Day 1 초기 일정이 비어 있지 않다", () => {
      const { schedules } = useScheduleStore.getState();
      expect(schedules[1].length).toBeGreaterThan(0);
    });

    it("Day 2 초기 일정이 비어 있지 않다", () => {
      const { schedules } = useScheduleStore.getState();
      expect(schedules[2].length).toBeGreaterThan(0);
    });

    it("Day 3 초기 일정이 비어 있지 않다", () => {
      const { schedules } = useScheduleStore.getState();
      expect(schedules[3].length).toBeGreaterThan(0);
    });

    it("food 초기 목록은 비어 있다", () => {
      const { schedules } = useScheduleStore.getState();
      expect(schedules.food).toHaveLength(0);
    });
  });

  describe("addVenueToDay", () => {
    it("장소를 food 목록에 추가할 수 있다", () => {
      const { addVenueToDay } = useScheduleStore.getState();
      addVenueToDay("day1-jidao", "food");
      const { schedules } = useScheduleStore.getState();
      expect(schedules.food).toContain("day1-jidao");
    });

    it("이미 있는 장소는 중복 추가되지 않는다", () => {
      const { addVenueToDay } = useScheduleStore.getState();
      addVenueToDay("day1-jidao", "food");
      addVenueToDay("day1-jidao", "food");
      const { schedules } = useScheduleStore.getState();
      expect(schedules.food.filter((id) => id === "day1-jidao")).toHaveLength(1);
    });

    it("다른 Day에 같은 장소를 추가할 수 있다", () => {
      const { addVenueToDay } = useScheduleStore.getState();
      addVenueToDay("day1-jidao", 2);
      const { schedules } = useScheduleStore.getState();
      expect(schedules[2]).toContain("day1-jidao");
    });
  });

  describe("removeVenueFromDay", () => {
    it("Day 1에서 장소를 삭제할 수 있다", () => {
      const state = useScheduleStore.getState();
      const firstId = state.schedules[1][0];
      state.removeVenueFromDay(firstId, 1);
      const { schedules } = useScheduleStore.getState();
      expect(schedules[1]).not.toContain(firstId);
    });

    it("없는 ID를 삭제해도 오류가 없다", () => {
      const { removeVenueFromDay } = useScheduleStore.getState();
      expect(() => removeVenueFromDay("non-existent", 1)).not.toThrow();
    });
  });

  describe("moveVenueUp", () => {
    it("두 번째 항목을 위로 이동하면 첫 번째가 된다", () => {
      const state = useScheduleStore.getState();
      const [first, second] = state.schedules[1];
      state.moveVenueUp(second, 1);
      const { schedules } = useScheduleStore.getState();
      expect(schedules[1][0]).toBe(second);
      expect(schedules[1][1]).toBe(first);
    });

    it("첫 번째 항목은 위로 이동되지 않는다", () => {
      const state = useScheduleStore.getState();
      const originalOrder = [...state.schedules[1]];
      state.moveVenueUp(originalOrder[0], 1);
      const { schedules } = useScheduleStore.getState();
      expect(schedules[1]).toEqual(originalOrder);
    });
  });

  describe("moveVenueDown", () => {
    it("첫 번째 항목을 아래로 이동하면 두 번째가 된다", () => {
      const state = useScheduleStore.getState();
      const [first, second] = state.schedules[1];
      state.moveVenueDown(first, 1);
      const { schedules } = useScheduleStore.getState();
      expect(schedules[1][0]).toBe(second);
      expect(schedules[1][1]).toBe(first);
    });

    it("마지막 항목은 아래로 이동되지 않는다", () => {
      const state = useScheduleStore.getState();
      const list = state.schedules[1];
      const last = list[list.length - 1];
      const originalOrder = [...list];
      state.moveVenueDown(last, 1);
      const { schedules } = useScheduleStore.getState();
      expect(schedules[1]).toEqual(originalOrder);
    });
  });

  describe("resetToDefault", () => {
    it("초기화 후 food 목록이 비워진다", () => {
      const { addVenueToDay, resetToDefault } = useScheduleStore.getState();
      addVenueToDay("day1-jidao", "food");
      resetToDefault();
      const { schedules } = useScheduleStore.getState();
      expect(schedules.food).toHaveLength(0);
    });

    it("초기화 후 Day 1 초기 장소가 복원된다", () => {
      const state = useScheduleStore.getState();
      const firstId = state.schedules[1][0];
      state.removeVenueFromDay(firstId, 1);
      state.resetToDefault();
      const { schedules } = useScheduleStore.getState();
      expect(schedules[1]).toContain(firstId);
    });
  });
});
