"use client";

import { useState, useEffect } from "react";
import { VenueCard } from "@/components/venue/VenueCard";
import { getNightviewVenues } from "@/data/venues";
import { NIGHTVIEW_RECOMMENDED_HOUR } from "@/data/constants";

// @MX:NOTE: 클라이언트 컴포넌트. 18:00 이후에 야경 섹션을 상단에 강조 표시.
export function NightviewSection() {
  const [isNightTime, setIsNightTime] = useState(false);
  const nightviewVenues = getNightviewVenues();

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsNightTime(hour >= NIGHTVIEW_RECOMMENDED_HOUR);
    };

    checkTime();
    // 1분마다 시간 체크
    const interval = setInterval(checkTime, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={isNightTime ? "order-first" : ""}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span>🌃</span>
        <span>야경 명소</span>
        {isNightTime ? (
          <span className="text-sm font-normal text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
            지금 추천!
          </span>
        ) : (
          <span className="text-sm font-normal text-gray-400">
            18:00 이후 추천
          </span>
        )}
      </h2>

      {isNightTime && (
        <div className="mb-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
          <p className="text-sm text-orange-700 font-medium">
            🌟 지금 야경 보기 최적의 시간입니다!
          </p>
          <p className="text-xs text-orange-500 mt-0.5">
            북와이탄이 와이탄보다 사람이 적고 뷰가 더 좋습니다
          </p>
        </div>
      )}

      <div className="space-y-3">
        {nightviewVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} compact />
        ))}
      </div>
    </section>
  );
}
