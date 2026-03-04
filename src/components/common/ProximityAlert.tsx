"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Venue } from "@/types/venue";
import { useGeolocation, getNearbyVenues } from "@/hooks/useGeolocation";
import { venues } from "@/data/venues";
import { CATEGORY_ICONS } from "@/data/constants";

// @MX:NOTE: 위치 권한 허용 시에만 활성화. 500m 이내 장소 자동 감지 후 카드 표시.
export function ProximityAlert() {
  const { latitude, longitude, error } = useGeolocation();
  const [nearbyVenue, setNearbyVenue] = useState<Venue | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const nearby = getNearbyVenues(latitude, longitude, venues, 500);
    const notDismissed = nearby.filter((v) => !dismissed.includes(v.id));

    if (notDismissed.length > 0) {
      setNearbyVenue(notDismissed[0]);
    } else {
      setNearbyVenue(null);
    }
  }, [latitude, longitude, dismissed]);

  // 위치 권한 없거나 에러이면 렌더링 안 함
  if (error || !nearbyVenue) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        <div className="bg-blue-500 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">📍</span>
            <span className="text-white text-xs font-medium">근처 여행 명소</span>
          </div>
          <button
            onClick={() => setDismissed((prev) => [...prev, nearbyVenue.id])}
            className="text-blue-100 hover:text-white text-xs"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">
              {CATEGORY_ICONS[nearbyVenue.category]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {nearbyVenue.name.ko}
                <span className="ml-1 text-gray-400 font-normal text-xs">
                  ({nearbyVenue.name.zh})
                </span>
              </p>
              {nearbyVenue.menuItems && nearbyVenue.menuItems.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  추천:{" "}
                  {nearbyVenue.menuItems
                    .filter((m) => m.recommended)
                    .slice(0, 2)
                    .map((m) => m.name.ko)
                    .join(", ")}
                </p>
              )}
              {nearbyVenue.description && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                  {nearbyVenue.description}
                </p>
              )}
            </div>
          </div>

          <Link
            href={`/venue/${nearbyVenue.id}`}
            className="mt-3 flex items-center justify-center gap-1 w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <span>상세 보기</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
