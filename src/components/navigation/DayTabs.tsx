"use client";

import { useRouter } from "next/navigation";
import { useFilterStore } from "@/store/useFilterStore";

const DAY_LABELS = {
  1: "Day 1",
  2: "Day 2",
  3: "Day 3",
};

interface DayTabsProps {
  onDayChange?: (day: 1 | 2 | 3) => void;
}

/**
 * 날짜 탭 컴포넌트
 */
export function DayTabs({ onDayChange }: DayTabsProps) {
  const router = useRouter();
  const { selectedDay, setSelectedDay } = useFilterStore();

  const handleDayClick = (day: 1 | 2 | 3) => {
    setSelectedDay(day);
    router.push(`/day/${day}`);
    onDayChange?.(day);
  };

  return (
    <div
      className="flex border-b border-gray-200 bg-white"
      role="tablist"
      aria-label="여행 날짜 선택"
    >
      {([1, 2, 3] as const).map((day) => (
        <button
          key={day}
          role="tab"
          aria-selected={selectedDay === day}
          aria-controls={`day-panel-${day}`}
          onClick={() => handleDayClick(day)}
          className={`flex-1 py-3 px-2 text-center transition-colors ${
            selectedDay === day
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="text-sm font-medium">{DAY_LABELS[day]}</div>
        </button>
      ))}
    </div>
  );
}
