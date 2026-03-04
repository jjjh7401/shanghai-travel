import type { DayRoute } from "@/types/route";
import { getVenuesByDay } from "./venues";

// 3일 여행 경로 데이터
export const dayRoutes: DayRoute[] = [
  {
    dayNumber: 1,
    title: "Day 1 - 프랑스 조계지 & 와이탄",
    description:
      "광동식 딤섬으로 시작해 임시정부, 우캉루 산책 후 와이탄 야경까지",
    venues: getVenuesByDay(1),
    totalCNY: 450,
    totalKRW: 90000,
  },
  {
    dayNumber: 2,
    title: "Day 2 - 루자쭈이 & 황푸강",
    description:
      "샤오양 군만두 아침, 상하이타워 무료 전망대, 황푸강 페리 체험",
    venues: getVenuesByDay(2),
    totalCNY: 508,
    totalKRW: 101600,
  },
  {
    dayNumber: 3,
    title: "Day 3 - 티엔즈팡 & 귀국",
    description: "길거리 아침 식사, 티엔즈팡 기념품 쇼핑, 출국 전 여유",
    venues: getVenuesByDay(3),
    totalCNY: 200,
    totalKRW: 40000,
  },
];

/**
 * 특정 날짜의 경로를 반환한다
 */
export function getDayRoute(dayNumber: 1 | 2 | 3): DayRoute | undefined {
  return dayRoutes.find((r) => r.dayNumber === dayNumber);
}
