# 상하이 IBT 여행 가이드 PWA

상하이 2박 3일 여행 일정을 쉽게 관리하고 지도에서 장소를 찾을 수 있는 PWA 애플리케이션입니다. IBT(인터내셔널 비즈니스 투어) 4개 조별 맞춤 일정을 제공하며, 오프라인 모드를 지원합니다.

## 주요 기능

### 조별 일정 관리 (신규 v0.3.x)
- **IBT 4개 조 지원**: 1~4조 선택 시 Day2 일정이 조별로 차별화
- **일정 커스터마이징**: 장소 추가·삭제·순서 변경
- **조 전환 후 복귀**: 다른 조로 이동 후 돌아와도 변경한 일정 유지
- **최단경로 정렬**: 선택한 장소들을 지도상 최단 이동거리 순으로 자동 재배열

### 일정 관리
- **Day별 일정**: 3일간의 여행 일정을 Day1, Day2, Day3로 구분하여 관리
- **장소 상세 정보**: 각 장소의 영업시간, 메뉴, 비용, 평가 등 상세 정보 제공
- **카테고리 분류**: 음식점, 관광지, 쇼핑, 액티비티 등 카테고리별 분류

### 지도 기능
- **Leaflet + OpenStreetMap**: API 키 없이 사용 가능한 오픈소스 지도
- **실시간 필터링**: Day별, 카테고리별로 마커를 실시간으로 필터링
- **맛집 탭**: 전체 날짜의 음식점·카페를 한눈에 모아보는 맛집 전용 필터
- **경로 표시**: 선택한 Day의 여행 경로를 지도에 시각화
- **사용자 위치**: GPS를 통한 현재 위치 표시 (초록 마커)
- **현재 위치 이동**: 지도 우하단 버튼 클릭 시 GPS 위치로 즉시 이동

### 길찾기 & 연동
- **Amap 길찾기**: 중국 내 가장 널리 사용되는 지도 앱과 연동
- **디ープ 링크**: 장소 상세 페이지에서 직접 Amap으로 길찾기 실행
- **WeChat, 점평**: 식당 평가 및 예약 서비스와 연동

### 여행 팁
- **공항 안내**: 상하이 푸둥/훙차오 공항 교통 정보
- **결제 가이드**: 중국 결제 방식 (알리페이, 위챗페이) 안내
- **오프라인 모드**: 인터넷 없이도 저장된 정보 열람 가능

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **UI 프레임워크**: React 19
- **스타일링**: Tailwind CSS 3
- **상태 관리**: Zustand 4
- **지도**: Leaflet + OpenStreetMap
- **PWA**: next-pwa 10
- **언어**: TypeScript 5
- **테스트**: Vitest 2, Testing Library

### 지원 환경

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상
- **브라우저**: 모든 최신 브라우저 (Chrome, Safari, Firefox, Edge)
- **모바일**: iOS Safari, Android Chrome 권장

## 시작하기

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd Shanghai_Travel

# 의존성 설치
npm install
```

### 개발

```bash
# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속할 수 있습니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start
```

### 사용자 매뉴얼 PDF 생성

```bash
# Playwright 기반 스크린샷 캡처 + PDF 생성
node scripts/generate-manual.mjs
```

개발 서버(`npm run dev`)가 실행 중인 상태에서 실행합니다. 생성된 파일:
- `manual-output/상하이IBT여행가이드_사용매뉴얼.pdf` — 한국어 8섹션 매뉴얼
- `manual-output/images/` — 13장 스크린샷 (390×844 모바일 뷰포트)

### 테스트

```bash
# 모든 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage
```

## 프로젝트 구조

```
src/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # 홈페이지 (일정 요약)
│   ├── layout.tsx                    # 레이아웃 및 네비게이션
│   ├── day/[dayNumber]/page.tsx      # Day별 상세 일정
│   ├── map/page.tsx                  # 지도 페이지
│   ├── venue/[venueId]/page.tsx      # 장소 상세 페이지
│   ├── tips/                         # 여행 팁 페이지
│   └── settings/page.tsx             # 설정 페이지
│
├── components/
│   ├── map/                          # 지도 컴포넌트
│   │   ├── LeafletMapContainer.tsx   # Leaflet 지도 (OpenStreetMap)
│   │   ├── DayFilter.tsx             # Day 필터
│   │   └── CategoryFilter.tsx        # 카테고리 필터
│   │
│   ├── venue/                        # 장소 관련 컴포넌트
│   │   ├── VenueCard.tsx             # 장소 카드
│   │   ├── VenueDetail.tsx           # 장소 상세 정보
│   │   ├── MenuList.tsx              # 메뉴 목록
│   │   └── CostDisplay.tsx           # 비용 표시
│   │
│   ├── navigation/                   # 네비게이션
│   │   ├── BottomNav.tsx             # 하단 네비게이션
│   │   └── DayTabs.tsx               # Day 탭
│   │
│   ├── common/                       # 공용 컴포넌트
│   │   ├── DeepLinkButton.tsx        # Amap 길찾기 버튼
│   │   ├── CurrencyDisplay.tsx       # 통화 표시
│   │   ├── OfflineIndicator.tsx      # 오프라인 상태 표시
│   │   └── ServiceWorkerRegister.tsx # PWA 등록
│   │
│   ├── home/                         # 홈페이지 컴포넌트
│   │   └── NightviewSection.tsx      # 야경 추천
│   │
│   └── __tests__/                    # 컴포넌트 테스트

├── lib/
│   └── deeplink.ts                   # Amap/WeChat 디ープ링크 생성

├── store/
│   └── useFilterStore.ts             # Zustand 필터 상태 관리

├── data/
│   └── venues.ts                     # 장소 데이터 (3일 일정)

└── styles/
    └── globals.css                   # 전역 스타일
```

## 주요 기능 상세

### 일정 관리 (Day별 페이지)

각 Day 페이지에서는 그날의 전체 일정을 시간 순서대로 확인할 수 있습니다.

- **시간별 일정**: 오전, 오후, 저녁으로 구분된 일정 표시
- **장소 링크**: 각 장소를 클릭하면 상세 정보 페이지로 이동
- **빠른 길찾기**: 각 장소에서 Amap으로 직접 길찾기 가능

### 지도 기능

Leaflet 기반의 대화형 지도입니다.

- **마커 표시**: 현재 선택한 Day의 모든 장소가 지도에 표시
- **맛집 탭**: Day 탭 옆 🍜 맛집 버튼으로 음식점·카페 전용 뷰 전환
- **카테고리 필터**: 카테고리를 선택/해제하여 마커 표시 여부 제어
- **경로 표시**: 하루 일정의 경로를 폴리라인으로 연결
- **현재 위치 버튼**: 지도 우하단 핀 버튼 클릭 시 내 GPS 위치로 이동
- **실시간 동기화**: 필터 변경 시 마커와 경로가 즉시 업데이트

### 장소 상세 페이지

```
/venue/[venueId]
```

각 장소의 상세 정보를 제공합니다.

- **기본 정보**: 장소명, 주소, 주소 코드, 영업시간
- **이미지**: 장소의 사진
- **메뉴 및 비용**: 대표 메뉴와 예상 비용 범위
- **평가 및 팁**: 다른 여행객들의 평가와 팁
- **길찾기**: Amap으로 길찾기, WeChat에서 공유, 점평에서 예약 링크

### Amap 길찾기 통합

디ープ링크를 통해 Amap과 seamlessly 연동됩니다.

- **시작점 자동 입력**: 사용자 현재 위치 자동 감지
- **도착점 지정**: 선택한 장소를 목적지로 설정
- **iOS/Android 지원**: 범용 링크로 모든 플랫폼 지원

## PWA 기능

이 애플리케이션은 PWA(Progressive Web App)로 개발되었습니다.

- **오프라인 모드**: Service Worker를 통한 오프라인 지원
- **앱 설치**: 홈 화면에 앱 아이콘 추가 가능
- **빠른 로딩**: 캐싱을 통한 빠른 초기 로딩
- **앱 푸시**: 배포 업데이트 시 자동 알림

## 배포

이 프로젝트는 Vercel에 배포되도록 최적화되어 있습니다.

```bash
# Vercel로 배포
npm i -g vercel
vercel
```

### 환경 변수

필요한 환경 변수가 없습니다. 모든 지도 서비스는 오픈소스이며 API 키가 필요하지 않습니다.

## 라이선스

MIT

## 기여

버그 리포트와 기능 제안은 GitHub Issues를 통해 제출해주세요.

## 문의

문제 발생 시 GitHub Issues를 통해 연락 주세요.

---

**마지막 업데이트**: 2026년 3월 8일
**버전**: 0.3.2
