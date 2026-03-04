"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/data/constants";
import type { VenueCategory } from "@/types/venue";

const CATEGORIES: VenueCategory[] = [
  "restaurant",
  "cafe",
  "attraction",
  "shopping",
  "transport",
  "nightview",
];

/**
 * 카테고리 필터 컴포넌트
 */
export function CategoryFilter() {
  const { selectedCategories, toggleCategory } = useFilterStore();

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isSelected
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span>{CATEGORY_ICONS[category]}</span>
            <span>{CATEGORY_LABELS[category]}</span>
          </button>
        );
      })}
    </div>
  );
}
