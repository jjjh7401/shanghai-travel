import type { Venue } from "@/types/venue";

// 전체 25개 장소 데이터
export const venues: Venue[] = [
  // ===== Day 1 (8개) =====
  {
    id: "day1-diandude",
    name: { ko: "점도덕", zh: "點都德" },
    category: "restaurant",
    dayNumber: 1,
    coordinates: { lat: 31.2244, lng: 121.4822 },
    description: "광동식 딤섬 전문점",
    menuItems: [
      {
        name: { ko: "호미 창펑", zh: "虾饺" },
        priceCNY: 28,
        recommended: true,
      },
      {
        name: { ko: "하가오", zh: "蟹黄饺" },
        priceCNY: 32,
        recommended: true,
      },
    ],
    order: 1,
  },
  {
    id: "day1-amasuzuo",
    name: { ko: "아마수작", zh: "阿妈蔗作" },
    category: "cafe",
    dayNumber: 1,
    coordinates: { lat: 31.2255, lng: 121.4835 },
    description: "밀크티 전문점",
    tips: [{ type: "must_know", content: "WeChat으로 사전 주문 가능" }],
    order: 2,
  },
  {
    id: "day1-provisional-gov",
    name: { ko: "임시정부", zh: "上海韩国临时政府" },
    category: "attraction",
    dayNumber: 1,
    coordinates: { lat: 31.2134, lng: 121.4634 },
    description: "대한민국 임시정부 청사",
    order: 3,
  },
  {
    id: "day1-wukang",
    name: { ko: "우캉루", zh: "武康路" },
    category: "attraction",
    dayNumber: 1,
    coordinates: { lat: 31.2119, lng: 121.4514 },
    description: "프랑스 조계지 건축 거리",
    order: 4,
  },
  {
    id: "day1-dongbei",
    name: { ko: "동북사계교자왕", zh: "东北四季饺子王" },
    category: "restaurant",
    dayNumber: 1,
    coordinates: { lat: 31.2285, lng: 121.4765 },
    costEstimate: { totalCNY: 94, totalKRW: 18800 },
    menuItems: [
      { name: { ko: "꿔바로" }, priceCNY: 48, recommended: true },
      { name: { ko: "교자" }, priceCNY: 46, recommended: true },
    ],
    order: 5,
  },
  {
    id: "day1-laojiu",
    name: { ko: "라오지우예", zh: "老九爷" },
    category: "restaurant",
    dayNumber: 1,
    coordinates: { lat: 31.2301, lng: 121.475 },
    description: "훠궈 전문점",
    costEstimate: { totalCNY: 356, totalKRW: 71200, persons: 2 },
    warnings: [
      {
        severity: "danger",
        content: "백탕 잘못 고르면 개구리 탕이 될 수 있음! 꼭 확인",
      },
    ],
    order: 6,
  },
  {
    id: "day1-nanjing",
    name: { ko: "난징시루/장원", zh: "南京西路/静安寺" },
    category: "attraction",
    dayNumber: 1,
    coordinates: { lat: 31.2289, lng: 121.4563 },
    description: "쇼핑/산책 거리",
    order: 7,
  },
  {
    id: "day1-bund",
    name: { ko: "와이탄", zh: "外滩" },
    category: "nightview",
    dayNumber: 1,
    coordinates: { lat: 31.2394, lng: 121.4899 },
    description: "황푸강변 야경 명소",
    bestTimeToVisit: "18:00 이후",
    order: 8,
  },

  // ===== Day 2 (10개) =====
  {
    id: "day2-xiaoyang",
    name: { ko: "샤오양셩지엔", zh: "小杨生煎" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.2302, lng: 121.4713 },
    costEstimate: { totalCNY: 104, totalKRW: 20800 },
    menuItems: [
      {
        name: { ko: "군만두", zh: "生煎" },
        priceCNY: 52,
        recommended: true,
      },
    ],
    order: 1,
  },
  {
    id: "day2-luckin",
    name: { ko: "루이싱커피", zh: "瑞幸咖啡" },
    category: "cafe",
    dayNumber: 2,
    coordinates: { lat: 31.229, lng: 121.472 },
    description: "중국 로컬 커피 체인",
    order: 2,
  },
  {
    id: "day2-shanghai-tower",
    name: { ko: "상하이타워 도운서점 52F", zh: "上海中心朵云书院" },
    category: "attraction",
    dayNumber: 2,
    coordinates: { lat: 31.2357, lng: 121.5052 },
    description: "무료 전망대, 사전 WeChat 예약 필수",
    tips: [
      {
        type: "money_saving",
        content: "무료 입장 (180위안 절약), 1인 1메뉴 구매 필수",
      },
    ],
    reservationInfo: {
      platform: "wechat",
      instructions: "WeChat 앱에서 '朵云书院' 검색 후 예약",
      required: true,
    },
    order: 3,
  },
  {
    id: "day2-disney-store",
    name: { ko: "디즈니스토어/샤오미", zh: "迪士尼/小米" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.234, lng: 121.505 },
    description: "쇼핑 명소",
    order: 4,
  },
  {
    id: "day2-ferry",
    name: { ko: "황푸강 페리", zh: "黄浦江轮渡" },
    category: "transport",
    dayNumber: 2,
    coordinates: { lat: 31.2388, lng: 121.4902 },
    description: "2위안으로 황푸강 건너기",
    costEstimate: { totalCNY: 2, totalKRW: 400 },
    order: 5,
  },
  {
    id: "day2-ribaixie",
    name: { ko: "리바이시에", zh: "日白蟹" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.231, lng: 121.5048 },
    costEstimate: { totalCNY: 202, totalKRW: 40400, persons: 2 },
    menuItems: [
      {
        name: { ko: "게살국수", zh: "蟹粉面" },
        priceCNY: 101,
        recommended: true,
      },
    ],
    tips: [{ type: "must_know", content: "대기 20분 예상" }],
    order: 6,
  },
  {
    id: "day2-hema",
    name: { ko: "허마선생", zh: "盒马鲜生" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2245, lng: 121.5063 },
    description: "슈퍼마켓/기념품",
    order: 7,
  },
  {
    id: "day2-halfdrink",
    name: { ko: "하프어드링크", zh: "半杯饮" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.225, lng: 121.507 },
    description: "양꼬치 맛집",
    order: 8,
  },
  {
    id: "day2-museum",
    name: { ko: "상하이박물관", zh: "上海博物馆" },
    category: "attraction",
    dayNumber: 2,
    coordinates: { lat: 31.2282, lng: 121.4738 },
    description: "중국 고대 문화재 전시",
    order: 9,
  },
  {
    id: "day2-north-bund",
    name: { ko: "북와이탄/황푸공원", zh: "北外滩/黄浦公园" },
    category: "nightview",
    dayNumber: 2,
    coordinates: { lat: 31.249, lng: 121.495 },
    description: "와이탄보다 사람이 적고 뷰가 좋은 야경 명소",
    bestTimeToVisit: "18:00 이후",
    order: 10,
  },

  // ===== Day 3 (7개) =====
  {
    id: "day3-jianbing",
    name: { ko: "지엔빙", zh: "煎饼" },
    category: "restaurant",
    dayNumber: 3,
    coordinates: { lat: 31.227, lng: 121.47 },
    description: "길거리 크레페",
    order: 1,
  },
  {
    id: "day3-manner",
    name: { ko: "매너커피", zh: "Manner Coffee" },
    category: "cafe",
    dayNumber: 3,
    coordinates: { lat: 31.2265, lng: 121.472 },
    description: "로컬 카페 체인",
    order: 2,
  },
  {
    id: "day3-lillian",
    name: { ko: "릴리안 베이커리", zh: "里昂面包房" },
    category: "cafe",
    dayNumber: 3,
    coordinates: { lat: 31.2259, lng: 121.471 },
    menuItems: [
      {
        name: { ko: "에그타르트", zh: "蛋挞" },
        priceCNY: 12,
        recommended: true,
      },
    ],
    order: 3,
  },
  {
    id: "day3-baowang",
    name: { ko: "패왕차희", zh: "霸王茶姬" },
    category: "cafe",
    dayNumber: 3,
    coordinates: { lat: 31.2151, lng: 121.455 },
    description: "밀크티 전문점",
    order: 4,
  },
  {
    id: "day3-tianzifang",
    name: { ko: "티엔즈팡", zh: "田子坊" },
    category: "shopping",
    dayNumber: 3,
    coordinates: { lat: 31.2127, lng: 121.4589 },
    description: "기념품 쇼핑 명소",
    order: 5,
  },
  {
    id: "day3-mamajia",
    name: { ko: "마마지아", zh: "妈妈家" },
    category: "restaurant",
    dayNumber: 3,
    coordinates: { lat: 31.2145, lng: 121.461 },
    menuItems: [
      {
        name: { ko: "마파두부", zh: "麻婆豆腐" },
        priceCNY: 38,
        recommended: true,
      },
    ],
    tips: [{ type: "recommendation", content: "마파두부 강추" }],
    order: 6,
  },
  {
    id: "day3-nail",
    name: { ko: "젤네일", zh: "美甲店" },
    category: "shopping",
    dayNumber: 3,
    coordinates: { lat: 31.216, lng: 121.4595 },
    costEstimate: { totalCNY: 150, totalKRW: 30000 },
    tips: [
      { type: "money_saving", content: "따종 앱 첫 구매 할인 적용 가능" },
    ],
    reservationInfo: {
      platform: "dianping",
      instructions: "따종 앱에서 검색 후 할인 쿠폰 사용",
      required: false,
    },
    order: 7,
  },
];

/**
 * 특정 날짜의 장소 목록을 반환한다
 * @param dayNumber - 날짜 (1, 2, 3)
 * @returns 해당 날짜의 장소 목록
 */
export function getVenuesByDay(dayNumber: 1 | 2 | 3): Venue[] {
  return venues
    .filter((v) => v.dayNumber === dayNumber)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * ID로 장소를 찾는다
 * @param id - 장소 ID
 * @returns 장소 또는 undefined
 */
export function getVenueById(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}

/**
 * 카테고리로 장소를 필터링한다
 * @param category - 카테고리
 * @returns 해당 카테고리의 장소 목록
 */
export function getVenuesByCategory(
  category: Venue["category"]
): Venue[] {
  return venues.filter((v) => v.category === category);
}

/**
 * 야경 명소 목록을 반환한다
 * @returns 야경 명소 목록
 */
export function getNightviewVenues(): Venue[] {
  return venues.filter((v) => v.category === "nightview");
}
