// 환율 설정
export const DEFAULT_CNY_TO_KRW_RATE = 200;

// 야경 추천 시간
export const NIGHTVIEW_RECOMMENDED_HOUR = 18;

// 카테고리 레이블 (한국어)
export const CATEGORY_LABELS = {
  restaurant: "음식점",
  cafe: "카페",
  attraction: "관광지",
  shopping: "쇼핑",
  transport: "교통",
  nightview: "야경",
} as const;

// 카테고리 아이콘 (이모지)
export const CATEGORY_ICONS = {
  restaurant: "🍜",
  cafe: "☕",
  attraction: "🏛️",
  shopping: "🛍️",
  transport: "🚌",
  nightview: "🌃",
} as const;

// Baidu Maps API 설정
export const BAIDU_MAP_KEY = process.env.NEXT_PUBLIC_BAIDU_MAP_KEY || "";

// 지도 기본 중심 (상하이)
export const MAP_DEFAULT_CENTER = {
  lat: 31.2304,
  lng: 121.4737,
};

// 지도 기본 줌 레벨
export const MAP_DEFAULT_ZOOM = 13;

// IBT 숙소 정보
export const ACCOMMODATION = {
  name: "하얏트 온 더 번드",
  nameZh: "上海外滩茂悦大酒店",
  nameEn: "Hyatt on the Bund, Shanghai",
  address: "199 Huangpu Rd, Hongkou District, Shanghai",
  coordinates: { lat: 31.2471, lng: 121.4858 },
  checkIn: "Day 1 도착 후",
  checkOut: "Day 4 출발 전",
} as const;
