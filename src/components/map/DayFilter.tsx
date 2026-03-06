"use client";

import { useFilterStore } from "@/store/useFilterStore";

/**
 * 지도 날짜 필터 컴포넌트 (전체/Day1/Day2/Day3/맛집)
 */
export function DayFilter() {
  const { selectedDay, setSelectedDay, showFoodOnly, setShowFoodOnly } = useFilterStore();

  const options = [
    { label: "전체", value: 0 },
    { label: "Day 1", value: 1 },
    { label: "Day 2", value: 2 },
    { label: "Day 3", value: 3 },
  ] as const;

  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5">
      {options.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => {
            setSelectedDay(value);
            setShowFoodOnly(false);
          }}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !showFoodOnly && selectedDay === value
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {label}
        </button>
      ))}
      <button
        onClick={() => {
          setShowFoodOnly(!showFoodOnly);
          if (!showFoodOnly) setSelectedDay(0);
        }}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          showFoodOnly
            ? "bg-orange-500 text-white"
            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
        }`}
      >
        🍜 맛집
      </button>
    </div>
  );
}
