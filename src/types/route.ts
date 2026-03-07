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

