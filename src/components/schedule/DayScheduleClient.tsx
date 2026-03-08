"use client";

import { useState, useEffect } from "react";
import { getVenueById } from "@/data/venues";
import { useScheduleStore } from "@/store/useScheduleStore";
import { VenueCard } from "@/components/venue/VenueCard";
import { SearchVenueModal } from "./SearchVenueModal";
import type { DayRoute } from "@/types/route";

interface DayScheduleClientProps {
  dayNumber: 1 | 2 | 3;
  route: DayRoute | undefined;
}

export function DayScheduleClient({ dayNumber, route }: DayScheduleClientProps) {
  const [mounted, setMounted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { schedules, removeVenueFromDay, moveVenueUp, moveVenueDown, resetToDefault, reorderByDistance } =
    useScheduleStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR 하이드레이션 불일치 방지 - 마운트 전에는 스켈레톤 표시
  if (!mounted) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const venueIds = schedules[dayNumber];
  const venues = venueIds
    .map((id) => getVenueById(id))
    .filter((v): v is NonNullable<typeof v> => v != null);

  function handleReset() {
    if (window.confirm(`Day ${dayNumber} 일정을 기본값으로 초기화하시겠습니까?`)) {
      resetToDefault();
    }
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* 날짜 헤더 */}
      {route && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <h1 className="text-lg font-bold">{route.title}</h1>
          <p className="text-sm text-blue-100 mt-1">{route.description}</p>
          {route.totalCNY && (
            <p className="text-sm text-blue-200 mt-2">
              예상 총 비용: {route.totalCNY} CNY (~
              {route.totalKRW?.toLocaleString("ko-KR")} KRW)
            </p>
          )}
        </div>
      )}

      {/* 장소 목록 */}
      <div className="space-y-3">
        {venues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-3xl mb-2">📍</p>
            <p className="text-sm">일정이 없습니다.</p>
            <p className="text-xs mt-1">아래 버튼으로 장소를 추가해보세요.</p>
          </div>
        ) : (
          venues.map((venue, idx) => (
            <div key={venue.id} className="flex gap-2 items-start">
              {/* 순서 번호 + 이동 버튼 */}
              <div className="flex flex-col items-center gap-0.5 pt-3 w-7 flex-shrink-0">
                <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <button
                  onClick={() => moveVenueUp(venue.id, dayNumber)}
                  disabled={idx === 0}
                  className="w-5 h-5 text-gray-400 hover:text-blue-500 disabled:opacity-25 flex items-center justify-center text-xs leading-none"
                  aria-label="위로 이동"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveVenueDown(venue.id, dayNumber)}
                  disabled={idx === venues.length - 1}
                  className="w-5 h-5 text-gray-400 hover:text-blue-500 disabled:opacity-25 flex items-center justify-center text-xs leading-none"
                  aria-label="아래로 이동"
                >
                  ▼
                </button>
              </div>

              {/* 카드 영역 + 삭제 버튼 */}
              <div className="flex-1 relative min-w-0">
                <VenueCard venue={venue} />
                <button
                  onClick={() => removeVenueFromDay(venue.id, dayNumber)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-500 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors"
                  aria-label={`${venue.name.ko} 삭제`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 하단 액션 버튼 */}
      <div className="flex gap-2 pt-2 pb-4">
        <button
          onClick={() => setShowSearch(true)}
          className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="text-base font-bold">+</span>
          장소 추가
        </button>
        <button
          onClick={() => reorderByDistance(dayNumber)}
          disabled={venues.length <= 1}
          className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="최단거리 순으로 정렬"
          title="선택된 장소들을 최단 이동거리 순으로 재배열합니다"
        >
          📍 최단경로
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-colors"
          aria-label="기본 일정으로 초기화"
        >
          초기화
        </button>
      </div>

      {/* 장소 검색 모달 */}
      {showSearch && <SearchVenueModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}
