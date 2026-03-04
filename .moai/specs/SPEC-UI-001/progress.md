# SPEC-UI-001 Progress

- Started: 2026-03-04
- Phase 1 Completed: 2026-03-04
- Phase 2 Completed: 2026-03-04

## Phase 1: 프로젝트 초기화 + 데이터 레이어 (완료)

### 완료 항목
- [x] Next.js 15.1.0 + TypeScript + Tailwind CSS + App Router 설정
- [x] vitest + @testing-library/react 설정
- [x] TypeScript 인터페이스 정의 (src/types/venue.ts, route.ts, tip.ts)
- [x] 25개 장소 데이터 구현 (src/data/venues.ts)
- [x] 3일 경로 데이터 (src/data/routes.ts)
- [x] 여행 팁 데이터 (src/data/tips.ts)
- [x] currency.ts, deeplink.ts 유틸리티

### TDD 결과
- currency.test.ts: 18/18 통과
- deeplink.test.ts: 12/12 통과
- useFilterStore.test.ts: 12/12 통과
- venues.test.ts: 21/21 통과

## Phase 2: 핵심 컴포넌트 + 페이지 (완료)

### 완료 항목
- [x] CurrencyDisplay, WarningBadge, DeepLinkButton, OfflineIndicator
- [x] BottomNav, DayTabs
- [x] VenueCard, VenueDetail, MenuList, CostDisplay
- [x] AMapContainer, DayFilter, CategoryFilter
- [x] 모든 페이지 구현 (홈, Day 1/2/3, 장소 상세 25개, 지도, 팁, 공항, 결제, 설정)

### TDD 결과
- CurrencyDisplay.test.tsx: 6/6 통과
- WarningBadge.test.tsx: 5/5 통과

## 최종 테스트 결과

**74/74 통과 (100%)**

## 빌드 결과

`npm run build` 성공 - 37개 정적 페이지 생성 (SSG)

## 기술적 결정 사항

1. AMap: SSR 미지원 → dynamic import + ssr: false, API 키 없을 때 폴백 UI
2. URL 인코딩: WeChat/Dianping 딥링크 원문 전달 (앱 호환성)
3. output: 'export' → Vercel 정적 배포
4. Zustand persist → 앱 설정 localStorage 영속화

## Acceptance Criteria 충족 현황

- [x] REQ-U-001: 한국어/중국어 이중 표시 (점도덕(點都德))
- [x] REQ-U-004: CNY/KRW 이중 통화 표시 (94 CNY (~18,800 KRW))
- [x] REQ-E-008: 경고 배지 (danger=빨강, caution=노랑)
- [x] REQ-S-002: AliPay 수수료 경고 (200 CNY 초과 시)
- [x] 25개 장소 데이터 완전 구현
- [x] 모바일 퍼스트 레이아웃 (320-430px)
