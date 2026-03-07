// 여행 팁
export interface TravelTip {
  id: string;
  category: "payment" | "transport" | "communication" | "safety" | "etiquette" | "airport";
  title: string;
  content: string;
  important?: boolean;
}

// 공항 정보
export interface AirportInfo {
  name: string;
  code: string;
  terminalInfo: string;
  transportOptions: {
    method: string;
    duration: string;
    cost: string;
    description: string;
  }[];
}
