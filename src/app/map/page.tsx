"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { useFilterStore } from "@/store/useFilterStore";
import { venues } from "@/data/venues";
import { DayFilter } from "@/components/map/DayFilter";
import { CategoryFilter } from "@/components/map/CategoryFilter";
import type { Venue } from "@/types/venue";
import { VenueCard } from "@/components/venue/VenueCard";
import { useGeolocation } from "@/hooks/useGeolocation";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/data/constants";

// 바이두 지도는 SSR 미지원이므로 dynamic import
const BaiduMapContainer = dynamic(
  () =>
    import("@/components/map/BaiduMapContainer").then((m) => ({
      default: m.BaiduMapContainer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400">
        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">지도 로드 중...</span>
      </div>
    ),
  }
);

/**
 * 지도 페이지 - Amap 지도 + 일차/카테고리 필터 + 위치기반 경로
 */
export default function MapPage() {
  const { selectedDay, selectedCategories } = useFilterStore();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const { latitude, longitude, error: geoError } = useGeolocation();

  // 필터 적용: 전체(0) 또는 선택 날짜 + 카테고리 필터
  const filteredVenues = venues.filter((v) => {
    if (selectedDay !== 0 && v.dayNumber !== selectedDay) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(v.category)) return false;
    return true;
  });

  const userLocation =
    latitude && longitude ? { lat: latitude, lng: longitude } : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="px-4 pt-4 pb-3 bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-gray-900">지도</h1>
          {userLocation ? (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              📍 위치 확인됨
            </span>
          ) : geoError ? (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              위치 권한 필요
            </span>
          ) : null}
        </div>
        <DayFilter />
        <div className="mt-2">
          <CategoryFilter />
        </div>
      </header>

      {/* 지도 */}
      <div className="px-3 pt-3" style={{ height: "45vh" }}>
        <BaiduMapContainer
          venues={filteredVenues}
          selectedVenueId={selectedVenue?.id}
          onVenueSelect={setSelectedVenue}
          showRoute={true}
          showUserLocation={true}
          userLocation={userLocation}
        />
      </div>

      {/* 선택된 장소 상세 카드 */}
      {selectedVenue && (
        <div className="mx-3 mt-3 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{CATEGORY_ICONS[selectedVenue.category]}</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedVenue.name.ko}
                    <span className="ml-1 text-sm text-gray-400 font-normal">
                      ({selectedVenue.name.zh})
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {CATEGORY_LABELS[selectedVenue.category]} · Day {selectedVenue.dayNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVenue(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            {selectedVenue.description && (
              <p className="text-sm text-gray-600 mt-2">{selectedVenue.description}</p>
            )}
            <Link
              href={`/venue/${selectedVenue.id}`}
              className="mt-3 flex items-center justify-center gap-1 w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              상세 정보 보기 →
            </Link>
          </div>
        </div>
      )}

      {/* 장소 목록 */}
      <div className="flex-1 px-3 py-3 space-y-2">
        <p className="text-xs text-gray-400 px-1">
          {selectedDay === 0 ? "전체" : `Day ${selectedDay}`} · {filteredVenues.length}개 장소
        </p>
        {filteredVenues.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">
            선택한 필터에 맞는 장소가 없습니다
          </p>
        ) : (
          filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              compact
            />
          ))
        )}
      </div>
    </div>
  );
}
