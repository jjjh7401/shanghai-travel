import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useFilterStore } from "../useFilterStore";

describe("useFilterStore", () => {
  beforeEach(() => {
    // 각 테스트 전 스토어 초기화
    act(() => {
      useFilterStore.getState().resetFilters();
    });
  });

  describe("초기 상태", () => {
    it("selectedDay는 0으로 초기화된다 (전체 보기)", () => {
      expect(useFilterStore.getState().selectedDay).toBe(0);
    });

    it("selectedCategories는 빈 배열로 초기화된다", () => {
      expect(useFilterStore.getState().selectedCategories).toEqual([]);
    });

  });

  describe("setSelectedDay", () => {
    it("선택된 날짜를 변경한다", () => {
      act(() => {
        useFilterStore.getState().setSelectedDay(2);
      });
      expect(useFilterStore.getState().selectedDay).toBe(2);
    });

    it("0은 전체 보기로 유효한 날짜이다", () => {
      act(() => {
        useFilterStore.getState().setSelectedDay(1);
        useFilterStore.getState().setSelectedDay(0);
      });
      expect(useFilterStore.getState().selectedDay).toBe(0);
    });

    it("유효하지 않은 날짜(4)는 무시한다", () => {
      act(() => {
        useFilterStore.getState().setSelectedDay(4);
      });
      expect(useFilterStore.getState().selectedDay).toBe(0);
    });
  });

  describe("toggleCategory", () => {
    it("카테고리를 토글로 추가한다", () => {
      act(() => {
        useFilterStore.getState().toggleCategory("restaurant");
      });
      expect(useFilterStore.getState().selectedCategories).toContain(
        "restaurant"
      );
    });

    it("이미 선택된 카테고리를 제거한다", () => {
      act(() => {
        useFilterStore.getState().toggleCategory("restaurant");
        useFilterStore.getState().toggleCategory("restaurant");
      });
      expect(useFilterStore.getState().selectedCategories).not.toContain(
        "restaurant"
      );
    });

    it("여러 카테고리를 선택할 수 있다", () => {
      act(() => {
        useFilterStore.getState().toggleCategory("restaurant");
        useFilterStore.getState().toggleCategory("cafe");
      });
      const categories = useFilterStore.getState().selectedCategories;
      expect(categories).toContain("restaurant");
      expect(categories).toContain("cafe");
    });
  });

  describe("resetFilters", () => {
    it("모든 필터를 초기 상태로 재설정한다", () => {
      act(() => {
        useFilterStore.getState().setSelectedDay(3);
        useFilterStore.getState().toggleCategory("restaurant");
        useFilterStore.getState().resetFilters();
      });

      const state = useFilterStore.getState();
      expect(state.selectedDay).toBe(0);
      expect(state.selectedCategories).toEqual([]);
    });
  });

  describe("복합 필터 로직", () => {
    it("카테고리와 날짜를 함께 필터링할 수 있다", () => {
      act(() => {
        useFilterStore.getState().setSelectedDay(2);
        useFilterStore.getState().toggleCategory("restaurant");
      });

      const state = useFilterStore.getState();
      expect(state.selectedDay).toBe(2);
      expect(state.selectedCategories).toContain("restaurant");
    });
  });
});
