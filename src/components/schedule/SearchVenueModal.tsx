"use client";

import { useState, useMemo } from "react";
import { venues as allVenues } from "@/data/venues";
import { useScheduleStore, type ScheduleDay } from "@/store/useScheduleStore";
import { CATEGORY_ICONS } from "@/data/constants";
import type { Venue } from "@/types/venue";

interface SearchVenueModalProps {
  onClose: () => void;
}

const DAY_OPTIONS: { label: string; value: ScheduleDay }[] = [
  { label: "Day 1", value: 1 },
  { label: "Day 2", value: 2 },
  { label: "Day 3", value: 3 },
  { label: "맛집", value: "food" },
];

const CATEGORY_LABELS_KO: Record<string, string> = {
  restaurant: "음식점",
  cafe: "카페",
  attraction: "관광지",
  shopping: "쇼핑",
  transport: "교통",
  nightview: "야경",
};

export function SearchVenueModal({ onClose }: SearchVenueModalProps) {
  const [query, setQuery] = useState("");
  const [addTarget, setAddTarget] = useState<Venue | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const { addVenueToDay, schedules } = useScheduleStore();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allVenues;
    return allVenues.filter(
      (v) =>
        v.name.ko.toLowerCase().includes(q) ||
        (v.name.zh && v.name.zh.toLowerCase().includes(q))
    );
  }, [query]);

  function handleAddClick(venue: Venue) {
    setAddTarget(venue);
  }

  function handleDaySelect(day: ScheduleDay) {
    if (!addTarget) return;
    addVenueToDay(addTarget.id, day);
    const dayLabel = DAY_OPTIONS.find((d) => d.value === day)?.label ?? String(day);
    setAddedNotice(`"${addTarget.name.ko}"을(를) ${dayLabel}에 추가했습니다.`);
    setAddTarget(null);
    setTimeout(() => setAddedNotice(null), 2500);
  }

  function isAlreadyAdded(venueId: string, day: ScheduleDay): boolean {
    return schedules[day].includes(venueId);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white sticky top-0">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="닫기"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="장소 이름으로 검색..."
            autoFocus
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <ul>
            {filtered.map((venue) => (
              <li
                key={venue.id}
                className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50"
              >
                <span className="text-2xl w-8 text-center flex-shrink-0">
                  {CATEGORY_ICONS[venue.category]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {venue.name.ko}
                  </p>
                  {venue.name.zh && (
                    <p className="text-xs text-gray-500 truncate">{venue.name.zh}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Day {venue.dayNumber} · {CATEGORY_LABELS_KO[venue.category] ?? venue.category}
                  </p>
                </div>
                <button
                  onClick={() => handleAddClick(venue)}
                  className="flex-shrink-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow transition-colors"
                  aria-label={`${venue.name.ko} 추가`}
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 성공 알림 토스트 */}
      {addedNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-gray-800 text-white text-sm px-4 py-2 rounded-full shadow-lg whitespace-nowrap pointer-events-none">
          {addedNotice}
        </div>
      )}

      {/* Day 선택 바텀시트 */}
      {addTarget && (
        <div
          className="fixed inset-0 z-[60] flex flex-col justify-end"
          onClick={() => setAddTarget(null)}
        >
          <div
            className="bg-white rounded-t-2xl p-5 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-semibold text-gray-800 text-center">
              어디에 추가할까요?
            </p>
            <p className="text-xs text-gray-500 text-center truncate px-4">
              {addTarget.name.ko}
            </p>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {DAY_OPTIONS.map(({ label, value }) => {
                const already = isAlreadyAdded(addTarget.id, value);
                return (
                  <button
                    key={String(value)}
                    onClick={() => !already && handleDaySelect(value)}
                    disabled={already}
                    className={`py-3 rounded-xl text-sm font-semibold transition-colors ${
                      already
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {label}
                    {already && (
                      <span className="block text-xs font-normal mt-0.5">추가됨</span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setAddTarget(null)}
              className="w-full py-3 text-sm text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
