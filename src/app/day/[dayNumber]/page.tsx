import { notFound } from "next/navigation";
import { getVenuesByDay } from "@/data/venues";
import { getDayRoute } from "@/data/routes";
import { VenueCard } from "@/components/venue/VenueCard";
import { DayTabs } from "@/components/navigation/DayTabs";

interface DayPageProps {
  params: Promise<{ dayNumber: string }>;
}

export function generateStaticParams() {
  return [{ dayNumber: "1" }, { dayNumber: "2" }, { dayNumber: "3" }];
}

/**
 * 날짜별 일정 페이지
 */
export default async function DayPage({ params }: DayPageProps) {
  const { dayNumber: dayNumberStr } = await params;
  const dayNumber = parseInt(dayNumberStr, 10) as 1 | 2 | 3;

  if (![1, 2, 3].includes(dayNumber)) {
    notFound();
  }

  const venues = getVenuesByDay(dayNumber);
  const route = getDayRoute(dayNumber);

  return (
    <div>
      {/* 날짜 탭 */}
      <DayTabs />

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
          {venues.map((venue, idx) => (
            <div key={venue.id} className="relative">
              {/* 순서 표시 */}
              <div className="absolute -left-1 top-4 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-10">
                {idx + 1}
              </div>
              <div className="ml-4">
                <VenueCard venue={venue} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
