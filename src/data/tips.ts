import type { TravelTip, AirportInfo } from "@/types/tip";

// 여행 팁 데이터
export const travelTips: TravelTip[] = [
  // 결제 관련
  {
    id: "payment-alipay-setup",
    category: "payment",
    title: "AliPay 설정 방법",
    content:
      "한국 계좌를 AliPay에 연동하거나 투어패스 카드를 사용하세요. 200위안 초과 결제 시 3% 수수료가 발생합니다.",
    important: true,
  },
  {
    id: "payment-wechat-pay",
    category: "payment",
    title: "WeChat Pay",
    content: "WeChat Pay도 널리 사용됩니다. 외국인은 해외 카드 연동 필요.",
    important: false,
  },
  {
    id: "payment-cash",
    category: "payment",
    title: "현금 사용",
    content:
      "일부 소규모 노점에서만 현금 필요. 대부분 QR 결제가 가능합니다.",
    important: false,
  },
  // 교통 관련
  {
    id: "transport-metro",
    category: "transport",
    title: "지하철 이용",
    content:
      "교통카드(교통联合卡)를 구매하면 편리합니다. AliPay나 WeChat Pay로도 결제 가능.",
    important: true,
  },
  {
    id: "transport-didi",
    category: "transport",
    title: "디디(滴滴) 택시",
    content:
      "중국판 우버. 앱 설치 후 해외 전화번호로 가입 가능. 목적지를 중국어로 보여주면 편리.",
    important: false,
  },
  {
    id: "transport-ferry",
    category: "transport",
    title: "황푸강 페리",
    content: "2위안으로 강을 건너는 로컬 경험. 와이탄↔동창로 노선 추천.",
    important: false,
  },
  // 통신 관련
  {
    id: "communication-vpn",
    category: "communication",
    title: "VPN 필수",
    content:
      "구글, 카카오톡 등 사용을 위해 VPN을 한국에서 미리 설치해야 합니다. 중국 내에서는 VPN 앱 다운로드 불가.",
    important: true,
  },
  {
    id: "communication-sim",
    category: "communication",
    title: "유심 선택",
    content:
      "중국 내에서 데이터 사용을 위해 로밍 또는 중국 유심 구매. 한국 유심으로 로밍하면 VPN 없이도 일부 서비스 사용 가능.",
    important: true,
  },
  // 안전 관련
  {
    id: "safety-scam",
    category: "safety",
    title: "사기 주의",
    content:
      "관광지 근처에서 차 마시러 가자는 제안은 바가지 사기일 가능성이 높습니다.",
    important: true,
  },
  // 에티켓 관련
  {
    id: "etiquette-chopsticks",
    category: "etiquette",
    title: "식당 에티켓",
    content:
      "중국 음식점에서 팁은 불필요합니다. 큰 소리로 '服务员(푸위위엔)'이라고 부르면 직원이 옵니다.",
    important: false,
  },
  // 공항 관련
  {
    id: "airport-pudong-arrival",
    category: "airport",
    title: "푸동공항 도착 절차",
    content:
      "입국심사 시 숙소 주소 필요. 호텔 예약확인서 또는 에어비앤비 주소를 미리 저장해두세요.",
    important: true,
  },
];

// 공항 정보
export const airportInfo: AirportInfo[] = [
  {
    name: "상하이 푸동 국제공항",
    code: "PVG",
    terminalInfo: "T1, T2 터미널 운영. 국제선은 주로 T2 사용.",
    transportOptions: [
      {
        method: "마그레브(자기부상열차)",
        duration: "8분",
        cost: "50 CNY",
        description: "세계에서 가장 빠른 상업용 열차. 시속 431km.",
      },
      {
        method: "지하철 2호선",
        duration: "60-70분",
        cost: "8 CNY",
        description: "가장 저렴한 방법. 인민광장 환승 가능.",
      },
      {
        method: "택시",
        duration: "40-60분",
        cost: "150-200 CNY",
        description: "편리하지만 비용이 높음. 미터제 택시 이용 권장.",
      },
    ],
  },
  {
    name: "상하이 홍교 국제공항",
    code: "SHA",
    terminalInfo: "T1, T2 터미널 운영.",
    transportOptions: [
      {
        method: "지하철 10호선",
        duration: "30-40분",
        cost: "4 CNY",
        description: "시내 접근성이 좋음.",
      },
      {
        method: "택시",
        duration: "20-40분",
        cost: "80-120 CNY",
        description: "시내와 가까워 택시도 합리적.",
      },
    ],
  },
];

/**
 * 카테고리별 팁을 반환한다
 */
export function getTipsByCategory(
  category: TravelTip["category"]
): TravelTip[] {
  return travelTips.filter((t) => t.category === category);
}

/**
 * 중요한 팁만 반환한다
 */
export function getImportantTips(): TravelTip[] {
  return travelTips.filter((t) => t.important);
}
