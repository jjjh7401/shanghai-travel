import type { Venue } from "@/types/venue";

// 전체 38개 장소 데이터 (IBT 가이드 반영 + 추가 명소)
export const venues: Venue[] = [
  // ===== Day 1 (5개) - IBT Day 1: Inspiration =====
  // 공식 일정: 지다오 점심(11:00-13:00) → 바이두파크(13:30-15:00) → 딥블루(15:30-17:00) → 왕츠핀취이 저녁(18:00~) → 호텔 복귀
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
    coordinates: { lat: 31.2885, lng: 121.1627 },
    address: {
      ko: "자딩구 안팅진 안즈루 113호",
      zh: "上海市嘉定区安亭镇安智路113号",
    },
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
    coordinates: { lat: 31.2149, lng: 121.3873 },
    address: {
      ko: "창닝구 웨이닝루 369호",
      zh: "上海市长宁区威宁路369号",
    },
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
    coordinates: { lat: 31.2351, lng: 121.4736 },
    address: {
      ko: "황포구 난징서루 2-68호 신세계성 8층 C03",
      zh: "上海市黄浦区南京西路2-68号 新世界城 8F C03",
    },
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
    id: "day1-hotel-return",
    name: { ko: "하얏트 온 더 번드 복귀", zh: "上海外滩茂悦大酒店" },
    category: "transport",
    dayNumber: 1,
    coordinates: { lat: 31.2453, lng: 121.4929 },
    address: {
      ko: "홍커우구 황푸루 199호 (Hyatt on the Bund)",
      zh: "上海市虹口区黄浦路199号",
    },
    description: "저녁 식사 후 IBT 공식 숙소로 복귀",
    tips: [{ type: "must_know", content: "199 Huangpu Rd, Hongkou District — 택시 또는 지하철 이용" }],
    order: 5,
  },

  // ===== Day 2 (9개) - IBT Day 2: Networking (미션 데이) =====
  // 공식 일정: 10:00~ 허마셴성 → 콜롬비아서클 → 월항조루(점심) → HARMAY → 우캉맨션 → 신천지 → 남경로 → 전취덕(저녁)
  {
    id: "day2-hema",
    name: { ko: "허마셴성 KING88", zh: "盒马鲜生 KING88" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2212, lng: 121.4239 },
    address: {
      ko: "창닝구 창닝루 88호 KING88몰 B1층",
      zh: "上海市长宁区长宁路88号 KING88商业广场 B1层",
    },
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
    order: 1,
  },
  {
    id: "day2-columbia",
    name: { ko: "콜롬비아 서클", zh: "上生新所 Columbia Circle" },
    category: "attraction",
    dayNumber: 2,
    coordinates: { lat: 31.2083, lng: 121.4281 },
    address: {
      ko: "창닝구 옌안서루 1262호",
      zh: "上海市长宁区延安西路1262号",
    },
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
    order: 2,
  },
  {
    id: "day2-wolyoung",
    name: { ko: "월항조루", zh: "粤港潮楼" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.2350, lng: 121.4801 },
    address: {
      ko: "황포구 구장루 600호 永安백화점 4-5층",
      zh: "上海市黄浦区九江路600号 永安百货 4F-5F",
    },
    description: "IBT 공식 점심 식사 장소 — 광동요리 전문 레스토랑",
    menuItems: [
      { name: { ko: "광동식 오리구이", zh: "广式烤鸭" }, priceCNY: 0, recommended: true },
      { name: { ko: "딤섬", zh: "点心" }, priceCNY: 0, recommended: true },
      { name: { ko: "홍미창", zh: "红米肠" }, priceCNY: 0, recommended: true },
    ],
    tips: [{ type: "must_know", content: "IBT 공식 점심 - 광동요리 전문점" }],
    order: 3,
  },
  {
    id: "day2-harmay",
    name: { ko: "HARMAY 화梅", zh: "话梅 HARMAY" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2134, lng: 121.4407 },
    address: {
      ko: "쉬후이구 안푸루 322호 2동 102호",
      zh: "上海市徐汇区安福路322号 2号楼 102室",
    },
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
    id: "day2-wukang-mansion",
    name: { ko: "우캉맨션", zh: "武康大楼" },
    category: "attraction",
    dayNumber: 2,
    coordinates: { lat: 31.2044, lng: 121.4384 },
    address: {
      ko: "쉬후이구 우캉루 99호",
      zh: "上海市徐汇区武康路99号",
    },
    description: "1924년 건축된 상하이 상징 삼각형 빌딩 — 미션 2 포토스팟 ⭐⭐⭐⭐⭐",
    missionInfo: {
      type: "photo",
      missionNumber: 2,
      description: "패들렛 좋아요 TOP 포토스팟 미션",
      photoSpotTips: "우캉루와 화이하이루 교차점의 삼각형 모양 구조물 + 플라타너스 가로수 구도 — 상하이 대표 인스타 아이코닉 스팟",
    },
    tips: [{ type: "recommendation", content: "패들렛 좋아요 전략 1위 스팟 — 삼각형 구도 사진으로 반응 최고" }],
    order: 5,
  },
  {
    id: "day2-xintiandi",
    name: { ko: "신천지 스쿠먼 골목", zh: "新天地石库门" },
    category: "attraction",
    dayNumber: 2,
    coordinates: { lat: 31.2200, lng: 121.4750 },
    address: {
      ko: "황포구 싱예루 123농",
      zh: "上海市黄浦区兴业路123弄",
    },
    description: "중국 전통 주택 양식과 서양 건축이 결합된 독특한 골목 — 스쿠먼 골목 사진 + 팝마트 방문",
    missionInfo: {
      type: "photo",
      missionNumber: 2,
      description: "스쿠먼 골목 인증샷 + 팝마트 방문 미션",
      photoSpotTips: "붉은 벽돌 + 아치형 문 조합 — 유니크한 배경으로 인증샷",
    },
    tips: [
      { type: "recommendation", content: "카페 거리 + 쇼핑몰도 함께 이용 가능" },
      { type: "must_know", content: "신천지 내 팝마트 매장 방문 — 라부부 등 소싱 상품 확인" },
    ],
    order: 6,
  },
  {
    id: "day2-popmart",
    name: { ko: "팝마트 플래그십 (남경로)", zh: "Pop Mart 泡泡玛特 南京路" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2349, lng: 121.4797 },
    description: "남경로 팝마트 플래그십 스토어 — 최종 소싱 상품 구매",
    missionInfo: {
      type: "sourcing",
      missionNumber: 2,
      description: "최종 소싱 상품 구매 미션 — 라부부 시리즈 GS SHOP 소싱 TOP 1",
      sourcingHighlight: "2025년 상반기 매출 139억 위안(약 2조 6천억 원) — 라부부 시리즈 글로벌 아이콘",
      photoSpotTips: "라부부 캐릭터 조형물 앞 인증샷 + 뽑기 개봉 리액션 컷",
    },
    tips: [
      { type: "recommendation", content: "소싱 TOP 1 추천: 라부부 플러시 인형 — GS SHOP 방송 스토리 최강" },
      { type: "warning", content: "정품 구매는 팝마트 공식 매장에서! 노점 판매품은 가품 주의" },
      { type: "must_know", content: "뽑기 전 재고 확인 필수" },
    ],
    order: 7,
  },
  {
    id: "day2-bingobox",
    name: { ko: "빙고박스 무인편의점", zh: "缤果盒子 BingoBox" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2213, lng: 121.4701 },
    description: "중국 최초 상용화 무인편의점 — 미션 1 AI 기술 체험",
    missionInfo: {
      type: "ai_tech",
      missionNumber: 1,
      description: "무인 AI 편의점 체험 미션 — 스마트 결제·자동 계산 시스템 인증샷",
      photoSpotTips: "입장 후 QR코드 결제 + 자동 계산대 앞 인증샷 촬영",
    },
    tips: [
      { type: "must_know", content: "WeChat Pay 또는 알리페이로 입장 및 결제" },
      { type: "recommendation", content: "AI 카메라 자동 감지 결제 시스템 — 한국에 없는 무인 리테일 체험" },
    ],
    order: 8,
  },
  {
    id: "day2-quanjude",
    name: { ko: "전취덕", zh: "全聚德" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.2188, lng: 121.4632 },
    address: {
      ko: "황포구 화이하이중루 780호 리스다이빌딩 4층",
      zh: "上海市黄浦区淮海中路780号 栗时代大厦 4F",
    },
    description: "IBT 공식 저녁 식사 장소 — 북경오리 전문 레스토랑",
    menuItems: [
      { name: { ko: "북경오리", zh: "北京烤鸭" }, priceCNY: 0, recommended: true },
    ],
    tips: [{ type: "must_know", content: "IBT 공식 저녁 - 중국 대표 전통 북경오리 레스토랑" }],
    order: 9,
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
    coordinates: { lat: 31.2084, lng: 121.4687 },
    address: {
      ko: "황포구 타이캉루 210농",
      zh: "上海市黄浦区泰康路210弄",
    },
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
    coordinates: { lat: 31.1530, lng: 121.4815 },
    address: {
      ko: "푸동신구 동위루 500호",
      zh: "上海市浦东新区东玉路500号",
    },
    description: "화화화 플라자 — 자유 일정 추천 쇼핑몰 (IBT 가이드 추천)",
    tips: [
      { type: "recommendation", content: "신흥 쇼핑 복합 단지 — 뷰티, 패션, F&B 다양하게 구성" },
      { type: "must_know", content: "249 Fangbang Middle Road, Huangpu District" },
    ],
    order: 8,
  },

  // ===== 맛집 추천 (MD 파일 참고) — 자유 시간 방문 추천 음식점/카페 =====
  {
    id: "food-yangsheng",
    name: { ko: "샤오양셩지엔", zh: "小杨生煎" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.2412, lng: 121.5063 },
    address: { ko: "푸동신구 루자주이환로 1406호 (루자주이점)", zh: "上海市浦东新区陆家嘴环路1406号" },
    description: "상하이식 성지엔 군만두 — 새우·고기·게살 3종류",
    menuItems: [
      { name: { ko: "새우 성지엔", zh: "虾肉生煎" }, priceCNY: 0, recommended: true },
      { name: { ko: "고기 성지엔", zh: "鲜肉生煎" }, priceCNY: 0, recommended: true },
      { name: { ko: "게살 성지엔", zh: "蟹肉生煎" }, priceCNY: 0, recommended: true },
    ],
    costEstimate: { totalCNY: 104, totalKRW: 20800, persons: 2 },
    tips: [
      { type: "must_know", content: "전국 프랜차이즈 체인 — 고덕지도에서 '小杨生煎' 검색 후 동선에 맞는 지점 방문" },
      { type: "recommendation", content: "루자주이 관광 후 방문하기 좋음 — 3종 합산 약 104위안 (2인)" },
    ],
    order: 20,
  },
  {
    id: "food-luckin",
    name: { ko: "루이싱커피", zh: "瑞幸咖啡 Luckin Coffee" },
    category: "cafe",
    dayNumber: 3,
    coordinates: { lat: 31.2193, lng: 121.4735 },
    description: "자스민 티 라떼, 코코넛 라떼 추천 — 전국 체인점",
    costEstimate: { totalCNY: 15, totalKRW: 3000 },
    tips: [
      { type: "money_saving", content: "루이싱 앱 다운로드 후 주문 시 더 저렴 — 아메리카노 9.9위안~, 첫 주문 할인 혜택" },
      { type: "must_know", content: "전국 체인 — 고덕지도에서 '瑞幸咖啡' 검색 후 가까운 지점 이용" },
    ],
    order: 21,
  },
  {
    id: "food-libaicrab",
    name: { ko: "리바이시에", zh: "李百蟹·蟹黄面·江景餐厅(外滩店)" },
    category: "restaurant",
    dayNumber: 1,
    coordinates: { lat: 31.2413, lng: 121.4893 },
    address: { ko: "황포구 중산동이로 22호 3층 (와이탄 22호)", zh: "上海市黄浦区中山东二路22号3楼 (外滩22号)" },
    description: "게살국수 맛집 — 동방명주 뷰 창가석 필수",
    menuItems: [
      { name: { ko: "게살국수", zh: "蟹黄面" }, priceCNY: 0, recommended: true },
    ],
    costEstimate: { totalCNY: 202, totalKRW: 40400, persons: 2 },
    tips: [
      { type: "must_know", content: "동방명주 뷰를 보려면 반드시 外滩二十二号(와이탄 22호) 지점 방문!" },
      { type: "warning", content: "평균 대기 20분 (주말 더 길어짐)" },
    ],
    order: 22,
  },
  {
    id: "food-halfdrink",
    name: { ko: "하프어드링크", zh: "半酌烧烤小酒馆(南京东路店)" },
    category: "restaurant",
    dayNumber: 1,
    coordinates: { lat: 31.2275, lng: 121.4742 },
    address: { ko: "황포구 산남로 278호 (난징동루점)", zh: "上海市黄浦区山南路278号" },
    description: "인민광장 인근 로컬 양꼬치 맛집 — 저녁 17:00~24:00 영업",
    tips: [
      { type: "must_know", content: "테이블 QR코드 스캔 주문 — 중국어 불필요" },
      { type: "recommendation", content: "저녁 일찍 방문 추천 (웨이팅 있을 수 있음)" },
    ],
    order: 23,
  },
  {
    id: "food-dimdodi",
    name: { ko: "점도덕 신천지점", zh: "點都德(环宇荟店)" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.2197, lng: 121.4734 },
    address: { ko: "황포구 황피남로 838농 환위후이 B1층", zh: "上海市黄浦区黄陂南路838弄 环宇荟B1层" },
    description: "정통 광둥식 딤섬 — 홍미창펀·하가오 추천",
    menuItems: [
      { name: { ko: "홍미창펀", zh: "红米肠粉" }, priceCNY: 0, recommended: true },
      { name: { ko: "하가오", zh: "虾饺" }, priceCNY: 0, recommended: true },
    ],
    costEstimate: { totalCNY: 125, totalKRW: 25000, persons: 2 },
    tips: [
      { type: "must_know", content: "한국어 메뉴판 제공!" },
      { type: "must_know", content: "지하철 9·13호선 마당루역 5번 출구" },
      { type: "warning", content: "주말 점심 웨이팅 20~30분 예상" },
    ],
    order: 24,
  },
  {
    id: "food-ahma",
    name: { ko: "아마수작", zh: "阿嬷手作·珍藏(新天地店)" },
    category: "cafe",
    dayNumber: 2,
    coordinates: { lat: 31.2190, lng: 121.4728 },
    address: { ko: "황포구 마당로 245호 (신천지점)", zh: "上海市黄浦区马当路245号" },
    description: "대만식 수제 쌀모찌 밀크티 — 웨이팅 필수 인기 카페",
    costEstimate: { totalCNY: 35, totalKRW: 7000 },
    tips: [
      { type: "warning", content: "평균 40분~1시간 대기 (주말 최대 2시간!)" },
      { type: "recommendation", content: "도착 최소 40분 전 위챗으로 사전 주문 강력 추천" },
    ],
    reservationInfo: { platform: "wechat", instructions: "위챗에서 '阿嬷手作' 검색 후 사전 주문", required: false },
    order: 25,
  },
  {
    id: "food-dongbei",
    name: { ko: "동북사계교자왕", zh: "东北四季饺子王" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.2135, lng: 121.4453 },
    address: { ko: "황포구 화이하이중로 1791호 (우캉루 근처)", zh: "上海市黄浦区淮海中路1791号" },
    description: "동북 음식 전문 — 꿔바로·교자·토마토 계란볶음",
    menuItems: [
      { name: { ko: "꿔바로", zh: "锅包肉" }, priceCNY: 0, recommended: true },
      { name: { ko: "교자", zh: "饺子" }, priceCNY: 0, recommended: true },
      { name: { ko: "토마토 계란볶음", zh: "西红柿炒鸡蛋" }, priceCNY: 0, recommended: true },
    ],
    costEstimate: { totalCNY: 94, totalKRW: 18800, persons: 2 },
    tips: [
      { type: "recommendation", content: "우캉맨션에서 도보 10분 거리" },
      { type: "must_know", content: "체인점 — 고덕지도에서 '东北四季饺子王' 검색 후 동선에 맞는 지점 선택" },
    ],
    order: 26,
  },
  {
    id: "food-laojiu",
    name: { ko: "라오지우예 훠궈", zh: "重庆高老九火锅(上海旗舰店)" },
    category: "restaurant",
    dayNumber: 2,
    coordinates: { lat: 31.2363, lng: 121.4798 },
    address: { ko: "황포구 지우장로 399호 화성빌딩 2층", zh: "上海市黄浦区九江路399号 华盛大厦2楼" },
    description: "현지인 충칭식 마라 훠궈 찐맛집 — 난징동루역 4번 출구 바로 앞",
    costEstimate: { totalCNY: 356, totalKRW: 71200, persons: 2 },
    tips: [
      { type: "warning", content: "백탕 선택 시 메뉴 확인 필수 — 개구리 탕 나올 수 있음!" },
      { type: "warning", content: "저녁 5시 이후 웨이팅 필수 — 사전 예약 강력 추천" },
      { type: "must_know", content: "지하철 2호선 난징동루역 4번 출구 바로 앞" },
    ],
    order: 27,
  },

  // ===== 추가 명소 8개 (자유 일정 추천) =====
  {
    id: "extra-chenghuang",
    name: { ko: "성황묘", zh: "城隍庙" },
    category: "attraction",
    dayNumber: 3,
    coordinates: { lat: 31.2270, lng: 121.4928 },
    address: {
      ko: "황포구 팡빙중루 249호",
      zh: "上海市黄浦区方浜中路249号",
    },
    description: "600년 된 상하이 도교 사원 — 다양한 거리음식 체험 가능",
    tips: [
      { type: "recommendation", content: "주변 예위안(豫园) 함께 방문 추천" },
      { type: "must_know", content: "탕후루, 난샹만터우 등 거리음식 체험 가능" },
    ],
    order: 28,
  },
  {
    id: "extra-1000trees",
    name: { ko: "1000 Trees", zh: "一千棵树" },
    category: "attraction",
    dayNumber: 3,
    coordinates: { lat: 31.2391, lng: 121.4427 },
    address: {
      ko: "푸퉈구 모간산루 600호",
      zh: "上海市普陀区莫干山路600号",
    },
    description: "유명 건축가 토마스 헤더윅이 설계한 현대적인 예술과 자연을 접목한 복합 공간",
    tips: [
      { type: "recommendation", content: "건물 옥상에 1000그루의 나무가 심어진 독특한 건축물" },
      { type: "recommendation", content: "인근 M50 창작 예술구 함께 방문 추천" },
    ],
    order: 29,
  },
  {
    id: "extra-bund",
    name: { ko: "와이탄 (황푸강변)", zh: "外滩 The Bund" },
    category: "nightview",
    dayNumber: 3,
    coordinates: { lat: 31.2401, lng: 121.4901 },
    address: {
      ko: "황포구 중산동이로",
      zh: "上海市黄浦区中山东一路",
    },
    description: "상하이의 스카이라인을 한눈에 구경할 수 있는 스팟 — 동방명주·루자쭈이 뷰 포인트",
    tips: [
      { type: "recommendation", content: "야경 필수 방문 — 일몰 후 30분이 가장 아름다운 시간" },
      { type: "must_know", content: "와이탄 22호(外滩22号) 레스토랑에서 창가 뷰 즐기며 식사 가능" },
    ],
    order: 30,
  },
  {
    id: "extra-bluebottle",
    name: { ko: "블루보틀 커피", zh: "蓝瓶咖啡 Blue Bottle Coffee" },
    category: "cafe",
    dayNumber: 2,
    coordinates: { lat: 31.2380, lng: 121.4448 },
    address: {
      ko: "징안구 창화루 908호 (위통루 근처)",
      zh: "上海市静安区昌化路908号(近裕通路)",
    },
    description: "블루보틀 커피 중국 1호점",
    tips: [
      { type: "recommendation", content: "미국 샌프란시스코 발 프리미엄 스페셜티 커피 브랜드" },
      { type: "must_know", content: "중국 최초 블루보틀 매장 — 심플하고 세련된 인테리어" },
    ],
    order: 31,
  },
  {
    id: "extra-tsutaya",
    name: { ko: "츠타야 서점", zh: "蔦屋書店 Tsutaya Books" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2082, lng: 121.4282 },
    address: {
      ko: "창닝구 옌안서루 1262호 콜롬비아 서클 9동",
      zh: "上海市长宁区延安西路1262号 上生·新所 9号楼",
    },
    description: "서양과 일본의 분위기가 함께 담긴 대형 서점 — 콜롬비아 서클 내 위치",
    tips: [
      { type: "recommendation", content: "일본 츠타야 서점의 감성을 그대로 — 책·라이프스타일 편집숍" },
      { type: "must_know", content: "콜롬비아 서클(上生新所) 방문 시 함께 들르기 좋음" },
    ],
    order: 32,
  },
  {
    id: "extra-provisional-govt",
    name: { ko: "대한민국 임시정부", zh: "大韩民国临时政府旧址" },
    category: "attraction",
    dayNumber: 3,
    coordinates: { lat: 31.2196, lng: 121.4742 },
    address: {
      ko: "황포구 마당로 306농 4호",
      zh: "上海市黄浦区马当路306弄4号",
    },
    description: "독립운동 역사 되돌아보기 — 1919~1932년 대한민국 임시정부 소재지",
    tips: [
      { type: "must_know", content: "입장료 무료 (화요일 휴관) — 한국어 오디오 가이드 제공" },
      { type: "recommendation", content: "신천지에서 도보 5분 거리 — 함께 방문 추천" },
    ],
    order: 33,
  },
  {
    id: "extra-duoyun",
    name: { ko: "두오원 서점", zh: "朵云书院" },
    category: "shopping",
    dayNumber: 2,
    coordinates: { lat: 31.2356, lng: 121.5013 },
    address: {
      ko: "푸동신구 인청중루 501호 상하이타워 52층",
      zh: "上海市浦东新区银城中路501号 上海中心大厦 52F",
    },
    description: "상하이 타워 52층에 위치한 서점 겸 복합 문화 공간",
    tips: [
      { type: "recommendation", content: "세계에서 가장 높은 서점 중 하나 — 루자쭈이 360도 뷰" },
      { type: "must_know", content: "상하이 타워 방문 시 함께 들르기 좋음 — 별도 입장료 없음" },
    ],
    order: 34,
  },
  {
    id: "extra-rumors-coffee",
    name: { ko: "Rumors Coffee", zh: "Rumors Coffee" },
    category: "cafe",
    dayNumber: 3,
    coordinates: { lat: 31.2141, lng: 121.4557 },
    address: {
      ko: "쉬후이구 후난루 9호",
      zh: "上海市徐汇区湖南路9号",
    },
    description: "핸드드립 커피를 맛볼 수 있는 작고 아늑한 카페",
    tips: [
      { type: "recommendation", content: "조용하고 아늑한 분위기 — 오래된 상하이 골목 감성" },
      { type: "must_know", content: "싱글오리진 핸드드립 커피 전문 — 우캉루 인근" },
    ],
    order: 35,
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
 * 야경 명소 목록을 반환한다
 * @returns 야경 명소 목록
 */
export function getNightviewVenues(): Venue[] {
  return venues.filter((v) => v.category === "nightview");
}
