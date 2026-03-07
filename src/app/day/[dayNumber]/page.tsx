import { notFound } from "next/navigation";
import { getDayRoute } from "@/data/routes";
import { DayTabs } from "@/components/navigation/DayTabs";
import { DayScheduleClient } from "@/components/schedule/DayScheduleClient";

interface DayPageProps {
  params: Promise<{ dayNumber: string }>;
}

export function generateStaticParams() {
  return [{ dayNumber: "1" }, { dayNumber: "2" }, { dayNumber: "3" }];
}

/**
 * 날짜별 일정 페이지 (Server Component)
 * 동적 일정 관리(추가/삭제/순서변경)는 DayScheduleClient에서 담당
 */
export default async function DayPage({ params }: DayPageProps) {
  const { dayNumber: dayNumberStr } = await params;
  const dayNumber = parseInt(dayNumberStr, 10) as 1 | 2 | 3;

  if (![1, 2, 3].includes(dayNumber)) {
    notFound();
  }

  const route = getDayRoute(dayNumber);

  return (
    <div>
      {/* 날짜 탭 */}
      <DayTabs />

      {/* 일정 관리 클라이언트 컴포넌트 */}
      <DayScheduleClient dayNumber={dayNumber} route={route} />
    </div>
  );
}
