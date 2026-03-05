import type { DayRoute } from "@/types/route";
import { getVenuesByDay } from "./venues";

// 3일 여행 경로 데이터
export const dayRoutes: DayRoute[] = [
  {
    dayNumber: 1,
    title: "Day 1 - Inspiration (AI 기업 탐방)",
    description:
      "지다오 점심 → 바이두 Apollo Park · 딥블루 AI 기술 견학 → 왕츠핀취이 저녁",
    venues: getVenuesByDay(1),
  },
  {
    dayNumber: 2,
    title: "Day 2 - Networking (미션 데이)",
    description:
      "허마셴성 AI 체험 → 우캉맨션 포토스팟 → 소싱 미션 → 전취덕 공식 저녁",
    venues: getVenuesByDay(2),
  },
  {
    dayNumber: 3,
    title: "Day 3 - Refresh (자유 일정)",
    description: "지엔빙 아침 → 카페 투어 → 티엔즈팡 기념품 쇼핑 → 출국",
    venues: getVenuesByDay(3),
  },
];

/**
 * 특정 날짜의 경로를 반환한다
 */
export function getDayRoute(dayNumber: 1 | 2 | 3): DayRoute | undefined {
  return dayRoutes.find((r) => r.dayNumber === dayNumber);
}
