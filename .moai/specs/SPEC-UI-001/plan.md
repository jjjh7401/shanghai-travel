# SPEC-UI-001: 구현 계획

## 메타데이터

| 항목 | 내용 |
|------|------|
| SPEC ID | SPEC-UI-001 |
| 제목 | Shanghai Travel Guide App - 구현 계획 |
| 상태 | Planned |

---

## 1. 기술 아키텍처

### 1.1 기술 스택

| 영역 | 기술 | 버전 | 비고 |
|------|------|------|------|
| 프레임워크 | Next.js (App Router) | 15.x+ | PWA 지원, SSG 활용 |
| 언어 | TypeScript | 5.5+ | 타입 안전성 |
| 스타일링 | Tailwind CSS | 3.x | 유틸리티 기반 |
| 컴포넌트 | shadcn/ui | latest | 접근성 내장 |
| 지도 | Amap JS API | v2.0 | 중국 지도 |
| 상태 관리 | Zustand | 5.x | 경량 상태 관리 |
| 오프라인 | next-pwa (Workbox) | latest | Service Worker |
| 데이터 | 정적 JSON | - | SSG 빌드 시 포함 |
| 배포 | Vercel | - | 빠른 배포, Next.js 최적화 |

### 1.2 프로젝트 구조

```
shanghai-travel/
├── public/
│   ├── manifest.json          # PWA 매니페스트
│   ├── icons/                 # PWA 아이콘
│   └── images/                # 장소 이미지
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈
│   │   ├── map/
│   │   │   └── page.tsx       # 지도 뷰
│   │   ├── day/
│   │   │   └── [dayNumber]/
│   │   │       └── page.tsx   # 일차별 상세
│   │   ├── venue/
│   │   │   └── [venueId]/
│   │   │       └── page.tsx   # 장소 상세
│   │   ├── tips/
│   │   │   ├── page.tsx       # 여행 팁 목록
│   │   │   ├── airport/
│   │   │   │   └── page.tsx   # 공항 이동
│   │   │   └── payment/
│   │   │       └── page.tsx   # 결제 팁
│   │   └── settings/
│   │       └── page.tsx       # 설정
│   ├── components/
│   │   ├── map/
│   │   │   ├── AMapContainer.tsx    # Amap 지도 래퍼
│   │   │   ├── VenueMarker.tsx      # 장소 마커
│   │   │   ├── RoutePolyline.tsx    # 경로 선
│   │   │   └── DayFilter.tsx        # 일차 필터
│   │   ├── venue/
│   │   │   ├── VenueCard.tsx        # 장소 카드
│   │   │   ├── VenueDetail.tsx      # 장소 상세
│   │   │   ├── MenuList.tsx         # 메뉴 목록
│   │   │   ├── WarningBadge.tsx     # 경고 배지
│   │   │   └── CostDisplay.tsx      # 비용 표시
│   │   ├── tips/
│   │   │   ├── AirportTransfer.tsx  # 공항 이동 비교표
│   │   │   └── PaymentAlert.tsx     # 결제 경고
│   │   ├── navigation/
│   │   │   ├── BottomNav.tsx        # 하단 네비게이션
│   │   │   └── DayTabs.tsx          # 일차 탭
│   │   └── common/
│   │       ├── CurrencyDisplay.tsx  # CNY/KRW 이중 통화
│   │       ├── OfflineIndicator.tsx # 오프라인 상태 표시
│   │       └── DeepLinkButton.tsx   # 딥링크 버튼
│   ├── data/
│   │   ├── venues.ts               # 장소 데이터
│   │   ├── routes.ts               # 경로 데이터
│   │   ├── tips.ts                  # 여행 팁 데이터
│   │   └── constants.ts            # 상수 정의
│   ├── hooks/
│   │   ├── useAMap.ts              # Amap 초기화 훅
│   │   ├── useOffline.ts           # 오프라인 상태 감지
│   │   ├── useGeolocation.ts       # 위치 정보
│   │   └── useDeepLink.ts         # 딥링크 처리
│   ├── lib/
│   │   ├── amap.ts                 # Amap API 유틸리티
│   │   ├── wechat.ts               # WeChat 딥링크 유틸
│   │   ├── currency.ts             # 환율 변환
│   │   └── offline.ts              # 오프라인 캐시 관리
│   ├── store/
│   │   ├── useFilterStore.ts       # 필터 상태
│   │   └── useAppStore.ts          # 앱 전역 상태
│   └── types/
│       ├── venue.ts                # 장소 타입
│       ├── route.ts                # 경로 타입
│       └── tip.ts                  # 팁 타입
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 1.3 아키텍처 다이어그램

```
[사용자 브라우저 (PWA)]
    │
    ├── [Next.js App Router] ──── SSG 정적 페이지
    │       │
    │       ├── [Amap JS API v2.0] ── 지도 렌더링, 경로, POI
    │       │
    │       ├── [정적 JSON 데이터] ── 장소, 경로, 팁
    │       │
    │       └── [Zustand Store] ── 필터, 설정, 방문 체크
    │
    ├── [Service Worker (Workbox)]
    │       ├── 정적 자산 캐시
    │       ├── JSON 데이터 캐시
    │       └── 지도 타일 캐시
    │
    └── [외부 연동]
            ├── WeChat URL Scheme (weixin://)
            ├── 따종 딥링크 (dianping://)
            └── Vercel (호스팅)
```

---

## 2. 마일스톤

### M1: 기본 UI 프레임워크 및 데이터 레이어 (Primary Goal)

**목표**: Next.js PWA 기반 프로젝트 세팅, 정적 데이터 구조화, 핵심 UI 컴포넌트 구현

**작업 목록**:
- [T-001] Next.js 프로젝트 초기화 (App Router, TypeScript, Tailwind CSS)
- [T-002] PWA 설정 (manifest.json, Service Worker 기본 설정)
- [T-003] 정적 장소 데이터 JSON 구조화 (25개 장소, 3일 경로)
- [T-004] 타입 정의 (Venue, DayRoute, TravelTip 인터페이스)
- [T-005] 공통 컴포넌트 구현 (CurrencyDisplay, WarningBadge, DeepLinkButton)
- [T-006] 홈 페이지 구현 (여행 개요, 일차 선택, 비용 요약)
- [T-007] 일차별 상세 페이지 구현 (장소 목록, 카테고리 필터)
- [T-008] 장소 상세 페이지 구현 (메뉴, 가격, 팁, 경고)
- [T-009] 하단 네비게이션 바 구현
- [T-010] 반응형 레이아웃 적용 (모바일 최적화)
- [T-011] 한국어/중국어 병기 표시 구현
- [T-012] CNY/KRW 이중 통화 표시 구현

**관련 요구사항**: REQ-U-001, REQ-U-002, REQ-U-004, REQ-E-008, REQ-N-003

**의존성**: 없음 (독립 시작 가능)

---

### M2: 지도 및 경로 시스템 (Primary Goal)

**목표**: Amap 지도 연동, 장소 마커 표시, 경로 렌더링, 일차별/카테고리별 필터링

**작업 목록**:
- [T-013] Amap JS API v2.0 연동 및 초기화 (useAMap 훅)
- [T-014] 지도 컨테이너 컴포넌트 구현 (AMapContainer)
- [T-015] 장소 마커 컴포넌트 구현 (카테고리별 아이콘 차별화)
- [T-016] 마커 탭 시 장소 상세 카드 팝업 구현
- [T-017] 일차별 탭 필터 구현 (Day 1/2/3)
- [T-018] 카테고리 필터 구현 (맛집/카페/야경/쇼핑)
- [T-019] 경로 폴리라인 렌더링 (일차별 동선)
- [T-020] Amap 도보 경로 API 연동 (두 장소 간 경로 + 소요 시간)
- [T-021] 사용자 현재 위치 표시 (Geolocation API)
- [T-022] 시간대 기반 야경 스팟 우선 추천 로직
- [T-023] 근접 알림 기능 (500m 반경)

**관련 요구사항**: REQ-E-001 ~ REQ-E-004, REQ-S-003, REQ-S-004, REQ-N-001

**의존성**: M1 (데이터 레이어, 장소 데이터)

---

### M3: 오프라인 지원 (Secondary Goal)

**목표**: Service Worker 기반 완전 오프라인 사용 지원

**작업 목록**:
- [T-024] Workbox 기반 Service Worker 구성
- [T-025] 정적 자산 프리캐싱 전략 구현 (Cache First)
- [T-026] JSON 데이터 캐싱 전략 구현 (Cache First, Network Fallback)
- [T-027] Amap 타일 캐싱 전략 구현 (상하이 중심부 zoom 12-16)
- [T-028] 이미지 자산 캐싱 구현
- [T-029] 오프라인 다운로드 버튼 및 진행률 표시 UI
- [T-030] 오프라인 상태 감지 및 인디케이터 표시 (useOffline 훅)
- [T-031] 캐시 크기 관리 및 만료 정책

**관련 요구사항**: REQ-U-003, REQ-E-007, REQ-S-001

**의존성**: M1, M2

---

### M4: WeChat/따종 딥링크 연동 (Secondary Goal)

**목표**: WeChat 미니프로그램 및 따종 앱 딥링크 연동

**작업 목록**:
- [T-032] WeChat URL Scheme 딥링크 모듈 구현 (weixin://)
- [T-033] WeChat JSSDK 초기화 (공유 기능용, 선택적)
- [T-034] 따종(大众点评) 딥링크 모듈 구현 (dianping://)
- [T-035] 딥링크 실패 시 웹 페이지 폴백 처리
- [T-036] 예약 정보가 있는 장소의 예약 버튼 UI 구현
- [T-037] 도운서점 WeChat 예약 플로우 안내 구현

**관련 요구사항**: REQ-E-005, REQ-E-006

**의존성**: M1 (DeepLinkButton 컴포넌트)

---

### M5: 여행 팁 모듈 (Secondary Goal)

**목표**: 공항 이동 비교, 결제 팁, 교통 정보 등 여행 도우미 기능

**작업 목록**:
- [T-038] 여행 팁 목록 페이지 구현
- [T-039] 공항 이동 비교표 구현 (택시/마그레브/지하철 비교)
- [T-040] DiDi 택시 사용 가이드 구현
- [T-041] AliPay 수수료 경고 시스템 구현 (200 CNY 초과 경고)
- [T-042] 분할 결제 권장 안내 카드 구현
- [T-043] 장소별 특별 주의사항 하이라이트 (예: 라오지우예 개구리 탕)

**관련 요구사항**: REQ-S-002

**의존성**: M1 (데이터 레이어)

---

### M6: 선택적 기능 (Optional Goal)

**목표**: 사용자 경험 향상 부가 기능

**작업 목록**:
- [T-044] 실시간 환율 API 연동 (CNY-KRW)
- [T-045] 장소 방문 체크 및 진행률 표시 (LocalStorage)
- [T-046] 장소별 메모 기능 (LocalStorage)
- [T-047] 다크 모드 지원 (Tailwind dark: 클래스)

**관련 요구사항**: REQ-O-001 ~ REQ-O-004

**의존성**: M1

---

## 3. 기술적 접근 방식

### 3.1 정적 데이터 전략

여행 데이터가 고정(YouTube 영상 기반)이므로 **SSG(Static Site Generation)** 활용:

- 모든 장소/경로/팁 데이터를 TypeScript 파일로 관리
- 빌드 시점에 정적 페이지 생성 (API 서버 불필요)
- JSON 형태로 Service Worker 캐싱 용이
- 데이터 업데이트 시 재빌드 후 재배포

### 3.2 Amap 지도 통합 전략

```typescript
// Amap JS API 동적 로딩 패턴
const loadAMapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.AMap) { resolve(); return; }
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Amap load failed'));
    document.head.appendChild(script);
  });
};
```

- 지도는 클라이언트 사이드에서만 렌더링 (`'use client'` 컴포넌트)
- Next.js dynamic import로 SSR 시 지도 제외
- Amap Walking API로 도보 경로 계산

### 3.3 오프라인 캐싱 전략

| 리소스 유형 | 캐싱 전략 | 이유 |
|------------|----------|------|
| HTML/CSS/JS | Cache First | 정적 빌드 결과물, 변경 드묾 |
| 장소/경로 JSON | Cache First | 정적 데이터, 오프라인 필수 |
| 지도 타일 | Network First + Cache | 네트워크 가능 시 최신 타일 사용 |
| 이미지 | Cache First | 변경 없는 정적 이미지 |
| 환율 API | Network Only | 실시간 데이터, 캐싱 불필요 |

### 3.4 WeChat 딥링크 전략

WeChat 공식 계정(공중호) 없이도 사용 가능한 방식 우선:

1. **URL Scheme 방식** (공식 계정 불필요): `weixin://dl/business/?t={path}`
2. **Universal Link 방식** (iOS): WeChat 등록 도메인 필요
3. **폴백 전략**: 딥링크 실패 시 WeChat 내 검색 안내 텍스트 표시

### 3.5 배포 전략

**Cloudflare Pages 선택 근거**:
- 중국 내 접근성: Cloudflare China Network 지원
- Vercel 대비 중국 접근 안정성 우위
- 정적 사이트 무료 호스팅
- Edge 캐싱으로 글로벌 빠른 응답

---

## 4. 리스크 및 대응 계획

| 리스크 | 영향도 | 발생 확률 | 대응 방안 |
|--------|--------|----------|----------|
| Amap API Key 발급 어려움 | High | Medium | Mapbox 중국 서비스 또는 Leaflet + 오픈 타일 서버 대안 검토 |
| Cloudflare 중국 접근 차단 | High | Low | Alibaba Cloud CDN 또는 중국 서버 배포 대안 |
| WeChat 딥링크 미작동 | Medium | Medium | 수동 안내 텍스트 + 스크린샷 가이드 폴백 |
| 오프라인 지도 타일 캐시 용량 초과 | Medium | Low | zoom 레벨 제한 (14-16), 관심 영역만 캐싱 |
| Amap 타일 캐싱 CORS 문제 | Medium | Medium | Cloudflare Workers 프록시 또는 자체 타일 서버 검토 |

---

## 5. 전문가 상담 권장

### 5.1 expert-frontend 상담 권장

- Amap JS API v2.0 통합 패턴 (React/Next.js 환경)
- PWA Service Worker 고급 캐싱 전략
- 모바일 최적화 UI/UX 패턴 (터치 인터랙션, 제스처)
- shadcn/ui 컴포넌트 커스터마이징

### 5.2 expert-backend 상담 권장

- Cloudflare Pages/Workers 배포 아키텍처
- 환율 API 프록시 (CORS 우회)
- Amap 타일 프록시 서버 (오프라인 캐싱용)

### 5.3 expert-devops 상담 권장

- Cloudflare Pages CI/CD 파이프라인
- 중국 내 접근성 테스트 전략
- 정적 자산 CDN 최적화
