// 장소 카테고리 타입
export type VenueCategory =
  | "restaurant"
  | "cafe"
  | "attraction"
  | "shopping"
  | "transport"
  | "nightview";

// 경고 심각도
export type WarningSeverity = "danger" | "caution";

// 팁 타입
export type TipType =
  | "must_know"
  | "money_saving"
  | "recommendation"
  | "warning";

// 이중 언어 이름
export interface BilingualName {
  ko: string;
  zh?: string;
}

// 한국어/중국어 주소
export interface Address {
  ko: string;
  zh: string;
}

// 좌표 (GCJ-02)
export interface Coordinates {
  lat: number;
  lng: number;
}

// 비용 추정
export interface CostEstimate {
  totalCNY: number;
  totalKRW: number;
  persons?: number;
}

// 메뉴 아이템
export interface MenuItem {
  name: BilingualName;
  priceCNY: number;
  recommended?: boolean;
}

// 경고
export interface Warning {
  severity: WarningSeverity;
  content: string;
}

// 팁
export interface Tip {
  type: TipType;
  content: string;
}

// 예약 정보
export interface ReservationInfo {
  platform: "wechat" | "dianping" | "other";
  instructions: string;
  required: boolean;
}

// 미션 정보 (2일차 IBT 미션 데이)
export interface MissionInfo {
  type: "ai_tech" | "sourcing" | "photo";
  description: string;
  missionNumber?: 1 | 2;
  photoSpotTips?: string;
  sourcingHighlight?: string;
}

// 장소 (Venue) 인터페이스
export interface Venue {
  id: string;
  name: BilingualName;
  category: VenueCategory;
  dayNumber: 1 | 2 | 3;
  coordinates: Coordinates;
  description?: string;
  costEstimate?: CostEstimate;
  menuItems?: MenuItem[];
  warnings?: Warning[];
  tips?: Tip[];
  reservationInfo?: ReservationInfo;
  address?: Address;
  bestTimeToVisit?: string;
  missionInfo?: MissionInfo;
  order?: number;
}
