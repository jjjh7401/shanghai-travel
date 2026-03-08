import Link from "next/link";
import { getVenuesByDay } from "@/data/venues";
import { dayRoutes } from "@/data/routes";
import { NightviewSection } from "@/components/home/NightviewSection";
import { GroupBadge } from "@/components/home/GroupBadge";
import { ACCOMMODATION } from "@/data/constants";

/**
 * 홈 페이지 - 여행 개요 및 빠른 접근
 * 야경 명소는 클라이언트 컴포넌트(NightviewSection)로 시간대별 표시
 */
export default function HomePage() {
  return (
    <div className="px-4 pt-6 pb-8 space-y-6">
      {/* 헤더 */}
      <header className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">상하이 여행 가이드</h1>
        <p className="text-gray-500 mt-1 text-sm">上海旅行指南 · 2박 3일</p>
        <div className="mt-2 flex justify-center">
          <GroupBadge />
        </div>
      </header>

      {/* 야경 명소 (클라이언트: 18:00 이후 상단 배치) */}
      <NightviewSection />

      {/* 숙소 정보 */}
      <section className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🏨</span>
          <h2 className="text-base font-semibold text-amber-900">IBT 공식 숙소</h2>
        </div>
        <p className="text-sm font-medium text-gray-900">{ACCOMMODATION.name}</p>
        <p className="text-xs text-gray-500">{ACCOMMODATION.nameZh}</p>
        <p className="text-xs text-gray-500 mt-1">{ACCOMMODATION.address}</p>
        <p className="text-xs text-amber-700 mt-1">체크인: {ACCOMMODATION.checkIn} · 체크아웃: {ACCOMMODATION.checkOut}</p>
      </section>

      {/* 날짜별 요약 카드 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">일정 요약</h2>
        <div className="space-y-3">
          {dayRoutes.map((route) => {
            const venueList = getVenuesByDay(route.dayNumber);
            return (
              <Link
                key={route.dayNumber}
                href={`/day/${route.dayNumber}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{route.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{route.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="text-sm font-medium text-gray-700">
                      {venueList.length}개 장소
                    </div>
                    {route.totalCNY && (
                      <div className="text-xs text-gray-400">~{route.totalCNY} CNY</div>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {venueList.slice(0, 4).map((v) => (
                    <span
                      key={v.id}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {v.name.ko}
                    </span>
                  ))}
                  {venueList.length > 4 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full">
                      +{venueList.length - 4}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 빠른 접근 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">빠른 접근</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/map"
            className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl border border-purple-100 active:bg-purple-100 transition-colors"
          >
            <span className="text-2xl mb-1">🗺️</span>
            <span className="text-sm font-medium text-purple-700">지도 보기</span>
          </Link>
          <Link
            href="/tips"
            className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border border-blue-100 active:bg-blue-100 transition-colors"
          >
            <span className="text-2xl mb-1">💡</span>
            <span className="text-sm font-medium text-blue-700">여행 팁</span>
          </Link>
          <Link
            href="/tips/payment"
            className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl border border-green-100 active:bg-green-100 transition-colors"
          >
            <span className="text-2xl mb-1">💳</span>
            <span className="text-sm font-medium text-green-700">결제 방법</span>
          </Link>
          <Link
            href="/tips/airport"
            className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl border border-orange-100 active:bg-orange-100 transition-colors"
          >
            <span className="text-2xl mb-1">✈️</span>
            <span className="text-sm font-medium text-orange-700">공항 정보</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
