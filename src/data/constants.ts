// 앱 설정 상수
export const APP_NAME = "상하이 여행 가이드";
export const APP_VERSION = "0.1.0";

// 환율 설정
export const DEFAULT_CNY_TO_KRW_RATE = 200;

// AliPay 수수료 설정
export const ALIPAY_THRESHOLD_CNY = 200;
export const ALIPAY_FEE_PERCENTAGE = 3;

// 근접 알림 거리 (미터)
export const PROXIMITY_ALERT_DISTANCE_M = 500;

// 야경 추천 시간
export const NIGHTVIEW_RECOMMENDED_HOUR = 18;

// 날짜 범위
export const TRAVEL_DAYS = [1, 2, 3] as const;
export type TravelDay = (typeof TRAVEL_DAYS)[number];

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

// Amap API 설정
export const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY || "";
export const AMAP_SECURITY_JS_CODE =
  process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE || "";

// 지도 기본 중심 (상하이)
export const MAP_DEFAULT_CENTER = {
  lat: 31.2304,
  lng: 121.4737,
};

// 지도 기본 줌 레벨
export const MAP_DEFAULT_ZOOM = 13;
