import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGroupStore } from "@/store/useGroupStore";

// persist 미들웨어 bypass (jsdom localStorage 미지원)
vi.mock("zustand/middleware", () => ({
  persist: (fn: unknown) => fn,
  createJSONStorage: () => ({}),
}));

describe("useGroupStore", () => {
  beforeEach(() => {
    useGroupStore.setState({ selectedGroup: null, hasSelectedGroup: false });
  });

  describe("초기 상태", () => {
    it("selectedGroup은 null이다", () => {
      expect(useGroupStore.getState().selectedGroup).toBeNull();
    });

    it("hasSelectedGroup은 false이다", () => {
      expect(useGroupStore.getState().hasSelectedGroup).toBe(false);
    });
  });

  describe("setGroup", () => {
    it("1조를 선택하면 selectedGroup이 1이 된다", () => {
      useGroupStore.getState().setGroup(1);
      expect(useGroupStore.getState().selectedGroup).toBe(1);
    });

    it("조 선택 시 hasSelectedGroup이 true가 된다", () => {
      useGroupStore.getState().setGroup(2);
      expect(useGroupStore.getState().hasSelectedGroup).toBe(true);
    });

    it("4조까지 유효하게 선택된다", () => {
      for (const g of [1, 2, 3, 4] as const) {
        useGroupStore.getState().setGroup(g);
        expect(useGroupStore.getState().selectedGroup).toBe(g);
      }
    });
  });

  describe("resetGroup", () => {
    it("조 선택을 초기화하면 selectedGroup이 null이 된다", () => {
      useGroupStore.getState().setGroup(3);
      useGroupStore.getState().resetGroup();
      expect(useGroupStore.getState().selectedGroup).toBeNull();
    });

    it("조 선택을 초기화하면 hasSelectedGroup이 false가 된다", () => {
      useGroupStore.getState().setGroup(4);
      useGroupStore.getState().resetGroup();
      expect(useGroupStore.getState().hasSelectedGroup).toBe(false);
    });
  });
});
