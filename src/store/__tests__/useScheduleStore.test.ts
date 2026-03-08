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

  describe("initializeForGroup", () => {
    it("처음 조를 선택하면 해당 조 기본 일정이 로드된다", () => {
      const { initializeForGroup } = useScheduleStore.getState();
      initializeForGroup(1);
      const { schedules, activeGroup } = useScheduleStore.getState();
      expect(activeGroup).toBe(1);
      expect(schedules[2].length).toBeGreaterThan(0);
    });

    it("조 변경 후 돌아오면 커스텀 일정이 유지된다", () => {
      const store = useScheduleStore.getState();
      // 1조 선택
      store.initializeForGroup(1);
      const day2Original = [...useScheduleStore.getState().schedules[2]];
      // 1조 일정에서 첫 번째 장소 삭제
      const removedId = day2Original[0];
      useScheduleStore.getState().removeVenueFromDay(removedId, 2);
      // 2조로 전환
      useScheduleStore.getState().initializeForGroup(2);
      expect(useScheduleStore.getState().activeGroup).toBe(2);
      // 다시 1조로 복귀
      useScheduleStore.getState().initializeForGroup(1);
      const { schedules } = useScheduleStore.getState();
      // 삭제한 장소가 없어야 함 (기본값이 아닌 커스텀 일정 로드)
      expect(schedules[2]).not.toContain(removedId);
    });

    it("이미 저장된 조로 돌아올 때 groupScheduleMap에서 로드한다", () => {
      const store = useScheduleStore.getState();
      store.initializeForGroup(3);
      // 3조 일정 수정
      useScheduleStore.getState().addVenueToDay("day1-jidao", 2);
      // 4조로 전환
      useScheduleStore.getState().initializeForGroup(4);
      // 3조로 복귀
      useScheduleStore.getState().initializeForGroup(3);
      const { schedules } = useScheduleStore.getState();
      expect(schedules[2]).toContain("day1-jidao");
    });
  });

  describe("reorderByDistance", () => {
    it("장소가 2개 이하면 순서가 변경되지 않는다", () => {
      const store = useScheduleStore.getState();
      store.initializeForGroup(1);
      const day1 = useScheduleStore.getState().schedules[1];
      // Day 1 장소를 1개만 남기고 모두 삭제
      day1.slice(1).forEach((id) => {
        useScheduleStore.getState().removeVenueFromDay(id, 1);
      });
      const before = [...useScheduleStore.getState().schedules[1]];
      useScheduleStore.getState().reorderByDistance(1);
      const after = useScheduleStore.getState().schedules[1];
      expect(after).toEqual(before);
    });

    it("reorderByDistance 결과는 원래 장소들의 순열이다", () => {
      const store = useScheduleStore.getState();
      store.initializeForGroup(1);
      const before = [...useScheduleStore.getState().schedules[2]];
      useScheduleStore.getState().reorderByDistance(2);
      const after = useScheduleStore.getState().schedules[2];
      // 같은 요소, 다른 순서일 수 있음 (순열 검증)
      expect([...after].sort()).toEqual([...before].sort());
    });

    it("food day에 reorderByDistance를 호출해도 상태가 변경되지 않는다", () => {
      const { schedules: before } = useScheduleStore.getState();
      useScheduleStore.getState().reorderByDistance("food");
      const { schedules: after } = useScheduleStore.getState();
      expect(after.food).toEqual(before.food);
    });

    it("reorderByDistance 후 groupScheduleMap이 업데이트된다", () => {
      const store = useScheduleStore.getState();
      store.initializeForGroup(2);
      useScheduleStore.getState().reorderByDistance(2);
      const { groupScheduleMap, schedules } = useScheduleStore.getState();
      expect(groupScheduleMap[2]).toEqual(schedules);
    });
  });
});
