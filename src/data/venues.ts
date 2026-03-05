import type { Venue } from "@/types/venue";

// 전체 37개 장소 데이터 (IBT 가이드 반영)
export const venues: Venue[] = [
  // ===== Day 1 (12개) - IBT Day 1: Inspiration =====
  // 공식 일정: 지다오 점심(11:00-13:00) → 바이두파크(13:30-15:00) → 딥블루(15:30-17:00) → 왕츠핀취이 저녁(18:00-)
  {
    id: "day1-jidao",
    name: { ko: "지다오 상하이차이", zh: "地道上海菜" },
    category: "restaurant",
    dayNumber: 1,
    coordinates: { lat: 31.2340, lng: 121.4820 },
    description: "IBT 공식 점심 식사 장소 (11:00~13:00)",
    menuItems: [
      { name: { ko: "새우요리", zh: "虾仁" }, priceCNY: 0, recommended: true },
      { name: { ko: "털게볶음", zh: "蟹粉豆腐" }, priceCNY: 0, recommended: true },
      { name: { ko: "오리요리", zh: "鸭肉" }, priceCNY: 0, recommended: true },
    ],
    tips: [{ type: "must_know", content: "IBT 공식 점심 - 상하이 로컬 음식 전문점" }],
    order: 1,
  },
  {
    id: "day1-baidu-park",
    name: { ko: "바이두 아폴로파크", zh: "百度Apollo Park" },
    category: "attraction",
    dayNumber: 1,
    coordinates: { lat: 31.2189, lng: 121.5350 },
    description: "IBT 공식 방문지 (13:30~15:00) — 바이두의 자율주행·AI 기술 체험 공간. Apollo RT6 자율주행차, Apolong 미니버스 탑승 체험 및 AI 쇼룸 견학",
    tips: [
      { type: "must_know", content: "중국 최대 AI 기업 바이두의 자율주행 플랫폼 Apollo 체험" },
      { type: "recommendation", content: "Apollo RT6 자율주행차 시승 및 시뮬레이터 체험 가능" },
    ],
    order: 2,
  },
  {
    id: "day1-deepblue",
    name: { ko: "딥블루 테크놀로지", zh: "深蓝科技 DeepBlue Technology" },
    category: "attraction",
    dayNumber: 1,
    coordinates: { lat: 31.2241, lng: 121.5014 },
    description: "IBT 공식 방문지 (15:30~17:00) — 2014년 설립된 AI 전문 기업. 스마트 스포츠·헬스케어·모빌리티·로봇 분야 AI 솔루션 보유. AI 바리스타, AI 피부 진단 등 체험 가능",
    tips: [
      { type: "must_know", content: "AI 기반 고객 서비스 솔루션 전문 기업 — GS SHOP 벤치마킹 대상" },
      { type: "recommendation", content: "AI 로봇 바리스타 체험 및 스마트 리테일 솔루션 시연 관람" },
    ],
    order: 3,
  },
  {
    id: "day1-wangchi",
    name: { ko: "왕츠핀취이", zh: "旺池品萃·融合菜" },
    category: "restaurant",
    dayNumber: 1,
    coordinates: { lat: 31.2256, lng: 121.4748 },
    description: "IBT 공식 저녁 식사 장소 (18:00~) — 新世界百货店 입점 전통 사천요리 레스토랑",
    menuItems: [
      { name: { ko: "고추 흑돼지볶음", zh: "辣椒黑猪肉" }, priceCNY: 0, recommended: true },
      { name: { ko: "갈비튀김", zh: "炸排骨" }, priceCNY: 0, recommended: true },
      { name: { ko: "홍콩식 마늘크랩", zh: "港式蒜蓉蟹" }, priceCNY: 0, recommended: true },
    ],
    tips: [{ type: "must_know", content: "IBT 공식 저녁 - 전통 사천요리 융합 레스토랑" }],
    order: 4,
  },
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
    order: 5,
  },
  {
    id: "day1-amasuzuo",
    name: { ko: "아마수작", zh: "阿妈蔗作" },
    category: "cafe",
    dayNumber: 1,
    coordinates: { lat: 31.2255, lng: 121.4835 },
    description: "밀크티 전문점",
    tips: [{ type: "must_know", content: "WeChat으로 사전 주문 가능" }],
    order: 6,
  },
  {
    id: "day1-provisional-gov",
    name: { ko: "임시정부", zh: "上海韩国临时政府" },
    category: "attraction",
    dayNumber: 1,
    coordinates: { lat: 31.2134, lng: 121.4634 },
    description: "대한민국 임시정부 청사",
    order: 7,
  },
  {
    id: "day1-wukang",
    name: { ko: "우캉루", zh: "武康路" },
    category: "attraction",
    dayNumber: 1,
    coordinates: { lat: 31.2119, lng: 121.4514 },
    description: "프랑스 조계지 건축 거리",
    order: 8,
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
    order: 9,
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
    order: 10,
  },
  {
    id: "day1-nanjing",
    name: { ko: "난징시루/장원", zh: "南京西路/静安寺" },
    category: "attraction",
    dayNumber: 1,
    coordinates: { lat: 31.2289, lng: 121.4563 },
    description: "쇼핑/산책 거리",
    order: 11,
  },
  {
    id: "day1-bund",
    name: { ko: "와이탄", zh: "外滩" },
    category: "nightview",
    dayNumber: 1,
    coordinates: { lat: 31.2394, lng: 121.4899 },
    description: "황푸강변 야경 명소",
    bestTimeToVisit: "18:00 이후",
    order: 12,
  },

  // ===== Day 2 (17개) - IBT Day 2: Networking (미션 데이) =====
  // 공식 일정: 10:00~16:00 유통가 탐방 미션 / 18:00~ 저녁 식사
  {
    id: "day2-wolyoung",
    name: { ko: "월항조루", zh: "粤港潮楼" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.2320, lng: 121.4723 },
    description: "IBT 공식 점심 식사 장소 — 광동요리 전문 레스토랑",
    menuItems: [
      { name: { ko: "광동식 오리구이", zh: "广式烤鸭" }, priceCNY: 0, recommended: true },
      { name: { ko: "딤섬", zh: "点心" }, priceCNY: 0, recommended: true },
      { name: { ko: "홍미창", zh: "红米肠" }, priceCNY: 0, recommended: true },
    ],
    tips: [{ type: "must_know", content: "IBT 공식 점심 - 광동요리 전문점" }],
    order: 1,
  },
  {
    id: "day2-hema",
    name: { ko: "허마셴성", zh: "盒马鲜生" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2245, lng: 121.5063 },
    description: "알리바바 운영 스마트 슈퍼마켓 — 미션 1 AI 기술 인증샷 필수 방문지",
    missionInfo: {
      type: "ai_tech",
      missionNumber: 1,
      description: "AI·첨단 기술 고객친화 서비스 인증샷 미션 — 한국에서 볼 수 없는 고객친화적 서비스 발견 후 패들렛 업로드",
      photoSpotTips: "천장 레일 배달 시스템 + 안면인식 계산대 앞에서 인증샷 촬영",
    },
    tips: [
      { type: "must_know", content: "안면인식 결제 체험 가능 (앱 없이 얼굴로 결제)" },
      { type: "recommendation", content: "천장 레일 30분 배달 시스템 인증샷 강력 추천!" },
      { type: "recommendation", content: "수조 해산물 즉석 조리 체험 가능" },
    ],
    order: 2,
  },
  {
    id: "day2-columbia",
    name: { ko: "콜롬비아 서클", zh: "上生新所 Columbia Circle" },
    category: "attraction",
    dayNumber: 2,
    coordinates: { lat: 31.2251, lng: 121.4363 },
    description: "1920년대 미국 컨트리클럽을 리뉴얼한 복합문화공간 — 미션 2 개인 포토스팟",
    missionInfo: {
      type: "photo",
      missionNumber: 2,
      description: "트렌디한 포토 스팟 미션 — 좋아요 많이 받기 전략",
      photoSpotTips: "바우하우스 스타일 건축 + 블루보틀 카페 앞, '시간이 멈춘 듯한 감성' 사진으로 패들렛 좋아요 폭발!",
    },
    tips: [
      { type: "recommendation", content: "블루보틀 카페 + 아웃도어 브랜드 컨셉스토어 방문 가능" },
      { type: "recommendation", content: "1920~40년대 미국 컨트리클럽 스타일 건물 — 인스타 감성 최고" },
    ],
    order: 3,
  },
  {
    id: "day2-harmay",
    name: { ko: "HARMAY 화梅", zh: "话梅 HARMAY" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2103, lng: 121.4497 },
    description: "안푸루 소재 창고형 뷰티 편집숍 — 미션 2 소싱 및 포토스팟",
    missionInfo: {
      type: "sourcing",
      missionNumber: 2,
      description: "GS SHOP 소싱 상품 탐색 및 트렌디 포토스팟 미션",
      sourcingHighlight: "샤넬·조말론·바이레도 등 럭셔리 브랜드 미니 사이즈/샘플 제품 큐레이션 편집숍",
      photoSpotTips: "금속 진열대 + 박스 쌓인 창고형 인테리어 — 냉랭한 창고 분위기 인스타 감성 폭발",
    },
    tips: [
      { type: "recommendation", content: "명품 뷰티 큐레이션 편집숍 — 한국에서 경험 불가" },
      { type: "money_saving", content: "미니 사이즈 샘플 세트로 합리적 구매 가능" },
    ],
    order: 4,
  },
  {
    id: "day2-xintiandi",
    name: { ko: "신천지 스쿠먼 골목", zh: "新天地石库门" },
    category: "attraction",
    dayNumber: 2,
    coordinates: { lat: 31.2194, lng: 121.4741 },
    description: "중국 전통 주택 양식과 서양 건축이 결합된 독특한 골목 — 미션 2 포토스팟",
    missionInfo: {
      type: "photo",
      missionNumber: 2,
      description: "트렌디한 사진 촬영 미션",
      photoSpotTips: "붉은 벽돌 + 아치형 문 조합 — 유니크한 배경으로 인증샷",
    },
    tips: [{ type: "recommendation", content: "카페 거리 + 쇼핑몰도 함께 이용 가능" }],
    order: 5,
  },
  {
    id: "day2-popmart",
    name: { ko: "팝마트 플래그십", zh: "Pop Mart 泡泡玛特" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2191, lng: 121.4749 },
    description: "AI 추천 기반 블라인드박스 — 미션 1 AI 체험 + 미션 2 소싱 후보 1위",
    missionInfo: {
      type: "ai_tech",
      missionNumber: 1,
      description: "AI 기술 체험 미션 + 소싱 상품 구매 미션",
      sourcingHighlight: "2025년 상반기 매출 139억 위안(약 2조 6천억 원) — 라부부 시리즈 글로벌 아이콘",
      photoSpotTips: "라부부 캐릭터 조형물 앞 인증샷 + 뽑기 개봉 리액션 컷",
    },
    tips: [
      { type: "recommendation", content: "소싱 TOP 1 추천: 라부부 플러시 인형 — GS SHOP 방송 스토리 최강" },
      { type: "warning", content: "정품 구매는 홍이플라자 팝마트 또는 신천지 팝마트에서! 노점 판매품은 가품 주의" },
      { type: "must_know", content: "뽑기 전 재고 확인 필수" },
    ],
    order: 6,
  },
  {
    id: "day2-wukang-mansion",
    name: { ko: "우캉맨션", zh: "武康大楼" },
    category: "attraction",
    dayNumber: 2,
    coordinates: { lat: 31.2097, lng: 121.4474 },
    description: "1924년 건축된 상하이 상징 삼각형 빌딩 — 미션 2 포토스팟 ⭐⭐⭐⭐⭐",
    missionInfo: {
      type: "photo",
      missionNumber: 2,
      description: "패들렛 좋아요 TOP 3 포토스팟 미션",
      photoSpotTips: "우캉루와 화이하이루 교차점의 삼각형 모양 구조물 + 플라타너스 가로수 구도 — 상하이 대표 인스타 아이코닉 스팟",
    },
    tips: [{ type: "recommendation", content: "패들렛 좋아요 전략 1위 스팟 — 삼각형 구도 사진으로 반응 최고" }],
    order: 7,
  },
  {
    id: "day2-quanjude",
    name: { ko: "전취덕", zh: "全聚德" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.2196, lng: 121.4853 },
    description: "IBT 공식 저녁 식사 장소 — 북경오리 전문 레스토랑",
    menuItems: [
      { name: { ko: "북경오리", zh: "北京烤鸭" }, priceCNY: 0, recommended: true },
    ],
    tips: [{ type: "must_know", content: "IBT 공식 저녁 - 중국 대표 전통 북경오리 레스토랑" }],
    order: 8,
  },
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
    order: 9,
  },
  {
    id: "day2-luckin",
    name: { ko: "루이싱커피", zh: "瑞幸咖啡" },
    category: "cafe",
    dayNumber: 2,
    coordinates: { lat: 31.229, lng: 121.472 },
    description: "중국 로컬 커피 체인",
    order: 10,
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
    order: 11,
  },
  {
    id: "day2-disney-store",
    name: { ko: "디즈니스토어/샤오미", zh: "迪士尼/小米" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.234, lng: 121.505 },
    description: "쇼핑 명소",
    order: 12,
  },
  {
    id: "day2-ferry",
    name: { ko: "황푸강 페리", zh: "黄浦江轮渡" },
    category: "transport",
    dayNumber: 2,
    coordinates: { lat: 31.2388, lng: 121.4902 },
    description: "2위안으로 황푸강 건너기",
    costEstimate: { totalCNY: 2, totalKRW: 400 },
    order: 13,
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
    order: 14,
  },
  {
    id: "day2-halfdrink",
    name: { ko: "하프어드링크", zh: "半杯饮" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.225, lng: 121.507 },
    description: "양꼬치 맛집",
    order: 15,
  },
  {
    id: "day2-museum",
    name: { ko: "상하이박물관", zh: "上海博物馆" },
    category: "attraction",
    dayNumber: 2,
    coordinates: { lat: 31.2282, lng: 121.4738 },
    description: "중국 고대 문화재 전시",
    order: 16,
  },
  {
    id: "day2-north-bund",
    name: { ko: "북와이탄/황푸공원", zh: "北外滩/黄浦公园" },
    category: "nightview",
    dayNumber: 2,
    coordinates: { lat: 31.249, lng: 121.495 },
    description: "와이탄보다 사람이 적고 뷰가 좋은 야경 명소",
    bestTimeToVisit: "18:00 이후",
    order: 17,
  },

  // ===== Day 3 (8개) - IBT Day 3: Refresh (자유 일정) =====
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
  {
    id: "day3-taikoo",
    name: { ko: "타이쿠리 첸탄", zh: "太古里前滩 Taikoo Li Qiantan" },
    category: "shopping",
    dayNumber: 3,
    coordinates: { lat: 31.2176, lng: 121.5265 },
    description: "화화화 플라자 — 자유 일정 추천 쇼핑몰 (IBT 가이드 추천)",
    tips: [
      { type: "recommendation", content: "신흥 쇼핑 복합 단지 — 뷰티, 패션, F&B 다양하게 구성" },
      { type: "must_know", content: "249 Fangbang Middle Road, Huangpu District" },
    ],
    order: 8,
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
