// 여행 팁 카테고리
export type TipCategory =
  | "payment"
  | "transport"
  | "communication"
  | "safety"
  | "etiquette"
  | "airport";

// 여행 팁
export interface TravelTip {
  id: string;
  category: TipCategory;
  title: string;
  content: string;
  important?: boolean;
}

// 공항 정보
export interface AirportInfo {
  name: string;
  code: string;
  terminalInfo: string;
  transportOptions: TransportOption[];
}

// 교통 옵션
export interface TransportOption {
  method: string;
  duration: string;
  cost: string;
  description: string;
}
