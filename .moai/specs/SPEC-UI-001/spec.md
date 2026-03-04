# SPEC-UI-001: 상하이 여행 가이드 앱

## 메타데이터

| 항목 | 내용 |
|------|------|
| SPEC ID | SPEC-UI-001 |
| 제목 | Shanghai Travel Guide App |
| 상태 | Planned |
| 우선순위 | High |
| 생성일 | 2026-03-04 |
| 담당 | expert-frontend, expert-backend |

## 관련 문서

- 원본 자료: `.moai/src/상하이 2박 3일 완벽 여행 루트.md`

---

## 1. Environment (환경)

### 1.1 운영 환경

- **플랫폼**: 크로스 플랫폼 모바일 앱 (React Native) + 웹 PWA (Next.js)
- **대상 지역**: 중국 상하이 (Great Firewall 환경 고려)
- **지도 API**: Amap(고덕지도, Gaode Maps) - 중국 내 Google Maps 차단으로 인한 필수 선택
- **언어**: 한국어 UI, 중국어 장소명 병기
- **네트워크**: 오프라인 우선 아키텍처 (중국 내 VPN 불안정 고려)
- **결제 환경**: AliPay, WeChat Pay 중심 (해외 카드 제한적)

### 1.2 기술 스택 결정 근거

#### 프레임워크 선택: Next.js PWA (권장)

| 기준 | React Native | Flutter | Next.js PWA |
|------|-------------|---------|-------------|
| 개발 속도 | 중간 | 중간 | **빠름** |
| 오프라인 지원 | 복잡 | 복잡 | **Service Worker** |
| 중국 지도 연동 | SDK 필요 | SDK 필요 | **JS API 직접 사용** |
| WeChat 연동 | 딥링크 | 딥링크 | **URL Scheme + JSSDK** |
| 배포 난이도 | 스토어 심사 | 스토어 심사 | **즉시 배포** |
| PWA 설치 | 불가 | 불가 | **홈 화면 추가** |

**선택 근거**: 여행 가이드 앱 특성상 빠른 접근성(URL 공유), 스토어 심사 불필요, 중국 내 웹 접근 가능, Service Worker 기반 오프라인 지원이 핵심. PWA가 네이티브 앱 대비 배포 및 접근성에서 우위.

#### 지도 API 선택: Amap (고덕지도)

| 기준 | Google Maps | Amap (고덕) | Baidu Maps |
|------|-------------|-------------|------------|
| 중국 내 작동 | **차단** | 작동 | 작동 |
| JS API 품질 | 우수 | **우수** | 보통 |
| 영문 문서 | 우수 | **양호** | 부족 |
| 보행자 경로 | 우수 | **우수** | 양호 |
| POI 데이터 | 중국 부족 | **중국 최적** | 중국 양호 |
| 해외 개발자 지원 | 우수 | **양호** | 부족 |

**선택 근거**: Google Maps는 중국 내 차단. Amap은 중국 내 가장 정확한 POI 데이터, 우수한 JS API, 보행자 경로 지원. Baidu Maps 대비 해외 개발자 문서화가 양호.

### 1.3 외부 의존성

- **Amap JS API v2.0**: 지도 렌더링, 경로 탐색, POI 검색
- **WeChat JSSDK**: WeChat 미니프로그램 딥링크, 공유 기능
- **AliPay URL Scheme**: 결제 관련 안내 링크
- **따종(大众点评) URL Scheme**: 서비스 예약 딥링크

---

## 2. Assumptions (가정)

### 2.1 기술적 가정

- [A-01] 사용자 디바이스는 iOS 15+ 또는 Android 10+ 모바일 브라우저를 사용한다
  - 근거: PWA 지원 브라우저 최소 요구사항
  - 신뢰도: High

- [A-02] Amap JS API v2.0은 해외(한국) 개발 환경에서 API Key 발급 및 테스트가 가능하다
  - 근거: Amap 오픈 플랫폼 해외 개발자 등록 지원
  - 신뢰도: Medium (실제 Key 발급 테스트 필요)

- [A-03] 중국 내에서 Next.js PWA 웹앱 접근이 가능하다 (호스팅 서버가 차단되지 않는 경우)
  - 근거: Vercel, Netlify 등 일부 CDN은 중국 내 접근 가능
  - 신뢰도: Medium (Vercel 중국 접근성 변동 가능, 대안: Cloudflare Pages)

- [A-04] Service Worker를 통한 오프라인 캐싱으로 지도 타일과 장소 데이터를 로컬 저장할 수 있다
  - 근거: PWA 표준 기능
  - 신뢰도: High

### 2.2 비즈니스 가정

- [A-05] 여행 루트 데이터는 정적이며, 자주 변경되지 않는다 (YouTube 영상 기반 고정 코스)
  - 근거: 원본 자료가 고정된 여행 루트
  - 신뢰도: High

- [A-06] 사용자는 WeChat이 설치된 상태에서 앱을 사용한다 (중국 여행 시 필수 앱)
  - 근거: 중국 내 WeChat 보편적 사용
  - 신뢰도: High

- [A-07] 주요 사용자는 한국인 상하이 여행자이다 (Korean UI 최적화)
  - 근거: 원본 콘텐츠가 한국어 유튜브 영상 기반
  - 신뢰도: High

### 2.3 위험 요소

- [R-01] Amap API Key 발급 시 중국 사업자 등록 또는 개인 인증이 필요할 수 있음
  - 대응: Amap 해외 개발자 계정 사전 확인, 대안으로 Mapbox (중국 내 제한적 작동) 검토

- [R-02] 중국 네트워크 환경에서 PWA 호스팅 서버 접근 차단 가능성
  - 대응: Cloudflare Pages 또는 중국 CDN (Alibaba Cloud CDN) 배포 검토

- [R-03] WeChat JSSDK 연동 시 중국 내 등록된 도메인 필요
  - 대응: WeChat 공식 계정 없이도 사용 가능한 URL Scheme 방식 우선 적용

---

## 3. Requirements (요구사항)

### 3.1 Ubiquitous (시스템 전역)

- [REQ-U-001] 시스템은 **항상** 한국어 UI를 기본으로 표시하며, 장소명은 한국어 + 중국어를 병기해야 한다
- [REQ-U-002] 시스템은 **항상** 반응형 레이아웃으로 모바일 화면(320px ~ 430px)에 최적화되어야 한다
- [REQ-U-003] 시스템은 **항상** 오프라인 상태에서도 장소 목록, 상세 정보, 여행 팁을 표시할 수 있어야 한다
- [REQ-U-004] 시스템은 **항상** 금액 표시 시 CNY(위안)와 KRW(원) 환산값을 함께 표시해야 한다

### 3.2 Event-Driven (이벤트 기반)

- [REQ-E-001] **WHEN** 사용자가 일차별 탭(Day 1/2/3)을 선택 **THEN** 해당 일차의 경로와 장소만 지도에 표시해야 한다
- [REQ-E-002] **WHEN** 사용자가 카테고리 필터(맛집/카페/야경/쇼핑)를 선택 **THEN** 해당 카테고리의 장소만 하이라이트해야 한다
- [REQ-E-003] **WHEN** 사용자가 장소 마커를 탭 **THEN** 장소 상세 카드(이름, 추천 메뉴, 가격, 팁)를 표시해야 한다
- [REQ-E-004] **WHEN** 사용자가 두 장소 사이 경로 보기를 요청 **THEN** Amap API를 통해 도보 경로와 예상 소요 시간을 표시해야 한다
- [REQ-E-005] **WHEN** 사용자가 WeChat 예약 버튼을 탭 **THEN** WeChat URL Scheme(weixin://)으로 해당 미니프로그램 또는 공중호를 열어야 한다
- [REQ-E-006] **WHEN** 사용자가 따종(大众点评) 링크를 탭 **THEN** 따종 앱 딥링크 또는 웹 페이지로 이동해야 한다
- [REQ-E-007] **WHEN** 사용자가 오프라인 다운로드 버튼을 탭 **THEN** 전체 여행 데이터(장소 정보, 지도 타일, 이미지)를 로컬에 캐싱해야 한다
- [REQ-E-008] **WHEN** 사용자가 장소 상세 카드에서 "경고" 태그가 있는 항목을 확인 **THEN** 경고 내용을 시각적으로 강조(빨간색 배경 또는 아이콘)하여 표시해야 한다

### 3.3 State-Driven (상태 기반)

- [REQ-S-001] **IF** 네트워크가 오프라인 상태 **THEN** 캐싱된 데이터로 장소 목록과 상세 정보를 표시하고, 지도는 캐싱된 타일로 렌더링해야 한다
- [REQ-S-002] **IF** 결제 금액이 200위안 이상 **THEN** AliPay 3% 수수료 경고 메시지와 분할 결제 권장 안내를 표시해야 한다
- [REQ-S-003] **IF** 현재 시각이 18:00 이후 **THEN** 야경 관련 장소(와이탄, 북와이탄, 황푸공원)를 우선 추천해야 한다
- [REQ-S-004] **IF** 사용자 위치가 특정 장소 반경 500m 이내 **THEN** 해당 장소의 알림 카드를 자동으로 표시해야 한다 (위치 권한 허용 시)

### 3.4 Unwanted (금지 사항)

- [REQ-N-001] 시스템은 Google Maps API를 사용**하지 않아야 한다** (중국 내 차단)
- [REQ-N-002] 시스템은 사용자 개인정보(위치 기록, 검색 기록)를 외부 서버로 전송**하지 않아야 한다**
- [REQ-N-003] 시스템은 인증/로그인 없이도 모든 핵심 기능을 사용할 수 있어야 하며, 로그인을 강제**하지 않아야 한다**

### 3.5 Optional (선택 사항)

- [REQ-O-001] **가능하면** 환율 API 연동을 통해 실시간 CNY-KRW 환율을 반영하여 금액을 표시한다
- [REQ-O-002] **가능하면** 사용자가 방문한 장소를 체크하고 진행률을 표시하는 기능을 제공한다
- [REQ-O-003] **가능하면** 사용자가 자신만의 메모를 장소별로 추가할 수 있는 기능을 제공한다
- [REQ-O-004] **가능하면** 다크 모드를 지원한다

---

## 4. Specifications (상세 사양)

### 4.1 데이터 모델

#### 4.1.1 Venue (장소)

```typescript
interface Venue {
  id: string;                    // 고유 ID (예: "day1-diandude")
  day: 1 | 2 | 3;               // 일차
  order: number;                 // 일차 내 순서
  name: {
    ko: string;                  // 한국어명 (예: "점도덕")
    zh: string;                  // 중국어명 (예: "點都德")
    en?: string;                 // 영문명 (선택)
  };
  category: VenueCategory;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: {
    ko: string;                  // 한국어 주소
    zh: string;                  // 중국어 주소
  };
  description: string;           // 장소 설명 (한국어)
  menuItems?: MenuItem[];        // 추천 메뉴
  tips?: Tip[];                  // 여행 팁
  warnings?: Warning[];          // 주의사항
  costEstimate?: CostEstimate;   // 비용 추정
  bestTimeToVisit?: string;      // 최적 방문 시간
  reservationInfo?: ReservationInfo; // 예약 정보
  rating?: number;               // 평점 (1-5)
  imageUrls?: string[];          // 이미지 URL 목록
}

type VenueCategory =
  | 'restaurant'    // 맛집
  | 'cafe'          // 카페
  | 'nightview'     // 야경
  | 'shopping'      // 쇼핑
  | 'attraction'    // 관광
  | 'transport';    // 교통

interface MenuItem {
  name: { ko: string; zh?: string };
  priceCNY: number;
  priceKRW: number;              // 환산값
  recommended: boolean;
  description?: string;
}

interface Tip {
  type: 'money_saving' | 'must_know' | 'recommendation';
  content: string;
}

interface Warning {
  severity: 'info' | 'caution' | 'danger';
  content: string;               // 예: "백탕 잘못 고르면 개구리 탕이 될 수 있음!"
}

interface CostEstimate {
  totalCNY: number;
  totalKRW: number;
  perPersonCNY?: number;
  perPersonKRW?: number;
  persons?: number;
}

interface ReservationInfo {
  platform: 'wechat' | 'dianping' | 'direct';
  deepLink?: string;             // WeChat: weixin:// / 따종 딥링크
  instructions: string;          // 예약 방법 안내
  required: boolean;             // 예약 필수 여부
}
```

#### 4.1.2 DayRoute (일차별 경로)

```typescript
interface DayRoute {
  day: 1 | 2 | 3;
  title: { ko: string };          // 예: "도착 후 시내 감성 산책 코스"
  venueIds: string[];             // 순서대로 정렬된 장소 ID 목록
  routeSegments: RouteSegment[];  // 구간별 경로 정보
}

interface RouteSegment {
  from: string;                   // 출발 장소 ID
  to: string;                     // 도착 장소 ID
  walkingMinutes?: number;        // 도보 소요 시간
  transportMode: 'walking' | 'taxi' | 'subway' | 'ferry';
  notes?: string;                 // 이동 관련 메모
}
```

#### 4.1.3 TravelTip (여행 팁)

```typescript
interface TravelTip {
  id: string;
  category: 'airport' | 'payment' | 'transport' | 'general';
  title: string;
  content: string;
  importance: 'high' | 'medium' | 'low';
}
```

### 4.2 페이지 구조

```
/                           # 홈 - 여행 개요 및 일차 선택
/map                        # 지도 뷰 - 전체/일차별 경로 표시
/day/[dayNumber]            # 일차별 상세 - 장소 목록 + 경로
/venue/[venueId]            # 장소 상세 - 메뉴, 가격, 팁, 경고
/tips                       # 여행 팁 모음 - 공항, 결제, 교통
/tips/airport               # 공항 이동 비교표
/tips/payment               # AliPay 수수료 경고 시스템
/settings                   # 설정 - 오프라인 다운로드, 다크 모드
```

### 4.3 WeChat 연동 아키텍처

```
사용자 탭 "WeChat 예약"
    │
    ├── 미니프로그램 지원 장소
    │   └── weixin://dl/business/?t={mini_program_path}
    │
    ├── 공중호(公众号) 지원 장소
    │   └── weixin://dl/officialaccount?username={account_id}
    │
    └── 일반 웹 예약
        └── https://target-url (외부 브라우저)
```

**WeChat URL Scheme 패턴**:
- 미니프로그램: `weixin://dl/business/?t={path}`
- 공식 계정: `weixin://dl/officialaccount?username={id}`
- 일반 링크: 브라우저 내 `window.location.href` 변경

**따종(大众点评) 딥링크**:
- 앱 설치 시: `dianping://shopinfo?shopid={id}`
- 미설치 시: `https://www.dianping.com/shop/{id}` 웹 페이지 대체

### 4.4 오프라인 지원 아키텍처

```
Service Worker
    │
    ├── 정적 자산 캐싱 (Cache First)
    │   ├── HTML, CSS, JS 번들
    │   ├── 폰트, 아이콘
    │   └── 이미지 자산
    │
    ├── 데이터 캐싱 (Cache First, Network Fallback)
    │   ├── 장소 데이터 (JSON)
    │   ├── 경로 데이터 (JSON)
    │   └── 여행 팁 데이터 (JSON)
    │
    ├── 지도 타일 캐싱 (Network First, Cache Fallback)
    │   └── Amap 타일 (상하이 중심부 zoom 12-16)
    │
    └── 동적 데이터 (Network Only)
        └── 실시간 환율 (선택적)
```

**오프라인 다운로드 용량 추정**:
- 장소/경로 데이터: ~500KB
- 이미지 자산: ~5MB (압축 후)
- 지도 타일 (상하이 중심부): ~20MB
- 총계: ~25MB

### 4.5 핵심 장소 데이터 (원본 자료 기반)

총 장소 수: **25개** (Day 1: 8개, Day 2: 10개, Day 3: 7개)

**Day 1 장소 목록**:
1. 점도덕(點都德) - 딤섬, 호미 창펑 + 하가오
2. 아마수작 - 밀크티, WeChat 사전 주문
3. 임시정부 - 관광
4. 우캉루 - 관광/산책
5. 동북사계교자왕 - 꿔바로 + 교자, 94 CNY
6. 라오지우예(老九爷) - 훠궈, 356 CNY/2인, WARNING: 백탕=개구리 탕 확인 필수
7. 난징시루/장원 - 관광/산책
8. 와이탄(The Bund) - 야경

**Day 2 장소 목록**:
1. 샤오양셩지엔 - 군만두, 104 CNY
2. 루이싱커피(Luckin Coffee) - 카페
3. 상하이타워 도운서점 52F - 무료 전망대 (180 CNY 절약), WeChat 예약 필수
4. 디즈니스토어/샤오미 - 쇼핑
5. 황푸강 페리 - 교통, 단 2 CNY
6. 리바이시에 - 게살국수, 202 CNY/2인, 대기 20분
7. 허마선생(Hema) - 슈퍼마켓/기념품
8. 하프어드링크 - 양꼬치
9. 상하이박물관 - 관광
10. 북와이탄/황푸공원 - 야경 (와이탄보다 추천)

**Day 3 장소 목록**:
1. 지엔빙(煎饼) - 길거리 크레페
2. 매너커피(Manner Coffee) - 카페
3. 릴리안 베이커리 - 에그타르트
4. 패왕차희 - 밀크티
5. 티엔즈팡 - 기념품 쇼핑
6. 마마지아 - 가정식, 마파두부 강추
7. 젤네일 - 따종 앱 할인, ~150 CNY

---

## 5. 추적성 (Traceability)

| 요구사항 ID | 관련 plan.md 마일스톤 | 관련 acceptance.md 시나리오 |
|------------|---------------------|--------------------------|
| REQ-U-001 | M1: 기본 UI 프레임워크 | AC-001: 한국어/중국어 병기 |
| REQ-U-002 | M1: 기본 UI 프레임워크 | AC-002: 반응형 레이아웃 |
| REQ-U-003 | M3: 오프라인 지원 | AC-003: 오프라인 데이터 접근 |
| REQ-U-004 | M1: 기본 UI 프레임워크 | AC-004: 이중 통화 표시 |
| REQ-E-001 | M2: 지도 및 경로 | AC-005: 일차별 필터링 |
| REQ-E-002 | M2: 지도 및 경로 | AC-006: 카테고리 필터 |
| REQ-E-003 | M2: 지도 및 경로 | AC-007: 장소 마커 상세 |
| REQ-E-004 | M2: 지도 및 경로 | AC-008: 도보 경로 안내 |
| REQ-E-005 | M4: WeChat 연동 | AC-009: WeChat 딥링크 |
| REQ-E-006 | M4: WeChat 연동 | AC-010: 따종 딥링크 |
| REQ-E-007 | M3: 오프라인 지원 | AC-011: 오프라인 다운로드 |
| REQ-E-008 | M1: 기본 UI 프레임워크 | AC-012: 경고 표시 |
| REQ-S-001 | M3: 오프라인 지원 | AC-013: 오프라인 지도 |
| REQ-S-002 | M5: 여행 팁 모듈 | AC-014: 결제 경고 |
| REQ-S-003 | M2: 지도 및 경로 | AC-015: 시간대 추천 |
| REQ-S-004 | M2: 지도 및 경로 | AC-016: 근접 알림 |
| REQ-N-001 | 전체 | AC-017: Google Maps 미사용 |
| REQ-N-002 | 전체 | AC-018: 개인정보 미전송 |
| REQ-N-003 | 전체 | AC-019: 비로그인 접근 |
