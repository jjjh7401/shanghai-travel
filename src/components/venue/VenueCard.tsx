"use client";

import Link from "next/link";
import type { Venue } from "@/types/venue";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/data/constants";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { WarningBadge } from "@/components/common/WarningBadge";
import { useAppStore } from "@/store/useAppStore";

interface VenueCardProps {
  venue: Venue;
  compact?: boolean;
}

/**
 * 장소 카드 컴포넌트 - 목록에서 표시
 */
export function VenueCard({ venue, compact = false }: VenueCardProps) {
  const { settings } = useAppStore();

  return (
    <Link
      href={`/venue/${venue.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md active:scale-[0.98] transition-all"
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg" aria-hidden="true">
              {CATEGORY_ICONS[venue.category]}
            </span>
            <h3 className="font-semibold text-gray-900 truncate">
              {venue.name.ko}
            </h3>
            {settings.showChineseNames && venue.name.zh && (
              <span className="text-sm text-gray-400">{venue.name.zh}</span>
            )}
          </div>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
            {CATEGORY_LABELS[venue.category]}
          </span>
        </div>

        {venue.bestTimeToVisit && (
          <span className="flex-shrink-0 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {venue.bestTimeToVisit}
          </span>
        )}
      </div>

      {/* 설명 */}
      {!compact && venue.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {venue.description}
        </p>
      )}

      {/* 비용 */}
      {venue.costEstimate && (
        <div className="mt-2">
          <CurrencyDisplay
            cny={venue.costEstimate.totalCNY}
            persons={venue.costEstimate.persons}
            exchangeRate={settings.exchangeRate}
            showAliPayWarning={true}
          />
        </div>
      )}

      {/* 경고 */}
      {!compact && venue.warnings && venue.warnings.length > 0 && (
        <div className="mt-2 space-y-1">
          {venue.warnings.slice(0, 1).map((warning, idx) => (
            <WarningBadge
              key={idx}
              severity={warning.severity}
              content={warning.content}
            />
          ))}
        </div>
      )}

      {/* 예약 필요 배지 */}
      {venue.reservationInfo?.required && (
        <div className="mt-2">
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
            📅 예약 필수
          </span>
        </div>
      )}
    </Link>
  );
}
