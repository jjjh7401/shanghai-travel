"use client";

import type { Venue } from "@/types/venue";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/data/constants";
import { WarningBadge } from "@/components/common/WarningBadge";
import { DeepLinkButton } from "@/components/common/DeepLinkButton";
import { MenuList } from "./MenuList";
import { CostDisplay } from "./CostDisplay";
import { useAppStore } from "@/store/useAppStore";

interface VenueDetailProps {
  venue: Venue;
}

/**
 * 장소 상세 정보 컴포넌트
 */
export function VenueDetail({ venue }: VenueDetailProps) {
  const { settings } = useAppStore();

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-4xl">{CATEGORY_ICONS[venue.category]}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{venue.name.ko}</h1>
            {settings.showChineseNames && venue.name.zh && (
              <p className="text-gray-500">{venue.name.zh}</p>
            )}
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {CATEGORY_LABELS[venue.category]}
            </span>
          </div>
        </div>

        {venue.description && (
          <p className="mt-3 text-gray-600">{venue.description}</p>
        )}

        {venue.address && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
            <div className="flex items-start gap-2 text-sm">
              <span className="flex-shrink-0 text-gray-400">📍</span>
              <span className="text-gray-700">{venue.address.ko}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="flex-shrink-0 text-gray-400">📍</span>
              <span className="text-gray-500">{venue.address.zh}</span>
            </div>
          </div>
        )}

        {venue.bestTimeToVisit && (
          <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
            <span>🕐</span>
            <span>추천 방문 시간: {venue.bestTimeToVisit}</span>
          </div>
        )}
      </div>

      {/* 미션 정보 (2일차 IBT 미션) */}
      {venue.missionInfo && (
        <div className={`rounded-xl p-4 shadow-sm border-l-4 ${
          venue.missionInfo.type === "ai_tech"
            ? "bg-blue-50 border-blue-500"
            : venue.missionInfo.type === "sourcing"
            ? "bg-green-50 border-green-500"
            : "bg-purple-50 border-purple-500"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">
              {venue.missionInfo.type === "ai_tech" ? "🤖" : venue.missionInfo.type === "sourcing" ? "🛍️" : "📸"}
            </span>
            <h2 className="font-semibold text-gray-900">
              {venue.missionInfo.missionNumber
                ? `IBT 미션 ${venue.missionInfo.missionNumber}`
                : "IBT 미션"}
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                venue.missionInfo.type === "ai_tech"
                  ? "bg-blue-100 text-blue-700"
                  : venue.missionInfo.type === "sourcing"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
              }`}>
                {venue.missionInfo.type === "ai_tech" ? "AI 기술 체험" : venue.missionInfo.type === "sourcing" ? "소싱 탐색" : "포토스팟"}
              </span>
            </h2>
          </div>
          <p className="text-sm text-gray-700 mb-2">{venue.missionInfo.description}</p>
          {venue.missionInfo.photoSpotTips && (
            <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
              <span className="flex-shrink-0">📍</span>
              <span>{venue.missionInfo.photoSpotTips}</span>
            </div>
          )}
          {venue.missionInfo.sourcingHighlight && (
            <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
              <span className="flex-shrink-0">✨</span>
              <span>{venue.missionInfo.sourcingHighlight}</span>
            </div>
          )}
        </div>
      )}

      {/* 경고 */}
      {venue.warnings && venue.warnings.length > 0 && (
        <div className="space-y-2">
          {venue.warnings.map((warning, idx) => (
            <WarningBadge
              key={idx}
              severity={warning.severity}
              content={warning.content}
            />
          ))}
        </div>
      )}

      {/* 비용 */}
      {venue.costEstimate && (
        <CostDisplay
          costEstimate={venue.costEstimate}
          exchangeRate={settings.exchangeRate}
        />
      )}

      {/* 메뉴 */}
      {venue.menuItems && venue.menuItems.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">추천 메뉴</h2>
          <MenuList items={venue.menuItems} exchangeRate={settings.exchangeRate} />
        </div>
      )}

      {/* 팁 */}
      {venue.tips && venue.tips.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">여행 팁</h2>
          <div className="space-y-2">
            {venue.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0">
                  {tip.type === "must_know" && "📌"}
                  {tip.type === "money_saving" && "💰"}
                  {tip.type === "recommendation" && "👍"}
                  {tip.type === "warning" && "⚠️"}
                </span>
                <span>{tip.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 예약 정보 */}
      {venue.reservationInfo && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">
            예약 정보
            {venue.reservationInfo.required && (
              <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                필수
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            {venue.reservationInfo.instructions}
          </p>
          <DeepLinkButton
            platform={venue.reservationInfo.platform}
            label={`${venue.reservationInfo.platform === "wechat" ? "WeChat" : "따종"} 열기`}
          />
        </div>
      )}

      {/* 지도 링크 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-3">길 찾기</h2>
        <DeepLinkButton
          platform="amap"
          label="Amap으로 길 찾기"
          lat={venue.coordinates.lat}
          lng={venue.coordinates.lng}
          venueName={venue.name.zh ?? venue.name.ko}
          venueAddress={venue.address?.zh}
          className="w-full justify-center"
        />
      </div>
    </div>
  );
}
