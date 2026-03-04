import type { Venue } from "./venue";

// 일정 경로
export interface DayRoute {
  dayNumber: 1 | 2 | 3;
  title: string;
  description: string;
  venues: Venue[];
  totalCNY?: number;
  totalKRW?: number;
}

// 전체 여행 경로
export interface TravelRoute {
  tripName: string;
  destination: string;
  days: DayRoute[];
}
