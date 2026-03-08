# 변경 사항

모든 주요 변경 사항은 이 파일에 기록됩니다.

[유지 보수 중](https://keepachangelog.com/ko/1.0.0/) 형식을 따릅니다.

## [0.3.2] - 2026-03-08

### 추가됨

#### IBT 4개 조 선택 시스템 (commit 77cc3b9)
- 첫 실행 시 조 선택 팝업 (`GroupSelectModal`) 표시
- 설정 페이지에서 조 변경 UI 추가
- `groupSchedules.ts`: 조별 Day2 일정 정의 (1~4조 각 8개 장소, 순서 상이)

#### 조별 일정 영구 저장 (commit 8ffea2f)
- `useScheduleStore`: `activeGroup` + `groupScheduleMap` 상태 추가
- 조 전환 후 복귀 시 변경된 일정 유지 (이전: 초기 기본값으로 리셋)
- 모든 일정 변경 액션이 `groupScheduleMap[activeGroup]` 자동 동기화

#### 최단경로 정렬 기능 (commit 8ffea2f)
- `DayScheduleClient`에 "📍 최단경로" 버튼 추가
- Nearest Neighbor 알고리즘 기반 최단 이동거리 순 재배열
- Haversine 공식으로 GCJ-02 좌표 간 거리 계산
- 장소 1개 이하일 때 버튼 비활성화

#### 상하이 추가 명소 8개 (commit 4909461)
- 성황묘, 1000 Trees, 와이탄, 블루보틀 커피, 츠타야 서점, 대한민국 임시정부, 두오원 서점, Rumors Coffee
- 총 장소 수 30개 → 38개

### 변경됨

#### UI 개선 (commit fee734f)
- Day 탭 서브타이틀 제거 (Day1/Day2/Day3 레이블만 표시)

### 테스트
- `useScheduleStore.test.ts`: 7개 테스트 추가 (조별 일정 영구 저장, 최단경로 정렬)
- `venues.test.ts`: 장소 수 카운트 업데이트 (38개)
- 총 108개 테스트 통과

## [0.3.1] - 2026-03-07

### 제거됨

#### Dead Code 정리 - 레거시 지도 컴포넌트 및 미사용 코드 (commit b157456)

**삭제된 파일 (5개, -701줄)**
- `AMapContainer.tsx` - LeafletMapContainer로 대체된 AMap 구현체
- `BaiduMapContainer.tsx` - LeafletMapContainer로 대체된 Baidu 구현체
- `useAMap.ts` - 미사용 AMap 훅
- `lib/amap.ts` - deeplink.ts로 대체된 AMap URL 생성 유틸
- `lib/wechat.ts` - deeplink.ts로 대체된 WeChat URL 생성 유틸

**미사용 exports 정리 (-56줄)**
- `constants.ts`: APP_NAME, APP_VERSION, ALIPAY_THRESHOLD_CNY, ALIPAY_FEE_PERCENTAGE, PROXIMITY_ALERT_DISTANCE_M, TRAVEL_DAYS, TravelDay, AMAP_SECURITY_JS_CODE
- `route.ts`: TravelRoute 인터페이스
- `tip.ts`: TipCategory, TransportOption

**테스트 업데이트**
- `venues.test.ts`: v0.3.0 맛집 데이터(8개) 추가 반영 (22→30, 5→7, 9→14, 8→9)

## [0.3.0] - 2026-03-06

### 추가됨

#### 지도 페이지 맛집 탭 (commit 3997d81)

**DayFilter 컴포넌트**
- `전체 | Day1 | Day2 | Day3` 탭 옆에 `🍜 맛집` 탭 버튼 추가 (주황색 활성화)
- 맛집 탭 선택 시 restaurant + cafe 카테고리 venue 전체 표시
- Day 탭과 맛집 탭은 상호 독립적으로 동작 (클릭 시 다른 탭 자동 해제)

**useFilterStore 상태 관리**
- `showFoodOnly: boolean` 상태 추가
- `setShowFoodOnly` 액션 추가

**venues.ts 맛집 데이터**
- MD 파일 참고 맛집 8개 추가 (샤오양셩지엔, 루이싱커피, 리바이시에, 하프어드링크, 점도덕, 아마수작, 동북사계교자왕, 라오지우예 훠궈)

#### 지도 현재 위치 이동 버튼 (commit cd65a9c)

**LeafletMapContainer 컴포넌트**
- 지도 우하단에 📍 위치 핀 버튼 추가
- GPS 허용 시: 초록색 활성화, 클릭 시 현재 위치로 `flyTo` 애니메이션 이동 (zoom 16)
- GPS 미허용/로딩 중: 회색 비활성화 처리

## [0.2.0] - 2026-03-05

### 수정됨

#### Day 탭 선택 및 Amap 길찾기 버그 수정 (commit 5b7f37a)

**DayTabs 컴포넌트**
- `useRouter().push('/day/${day}')` 추가 - Day 탭 클릭 시 해당 Day 페이지로 라우팅
- 이전에는 UI만 업데이트되고 실제 페이지 이동이 되지 않던 문제 해결

**Amap 디ープ링크 개선**
- 깊은 링크 URL 변경: `androidamap://` → `https://uri.amap.com/marker?...` (범용 링크)
- iOS와 Android 모두에서 작동하는 범용 링크 도입
- QR 코드 스캔 등 다양한 시나리오에서 호환성 향상

**DeepLinkButton 컴포넌트**
- `https://` URL에 대해 `window.open('_blank')` 방식으로 개선
- PWA 환경에서 새 탭 열기로 인한 네비게이션 손실 방지
- 사용자가 여행 앱과 지도 앱을 자유롭게 오가며 사용 가능

#### 지도 페이지 Day 필터 변경 시 마커 미갱신 버그 수정 (commit c64a24c)

**LeafletMapContainer 컴포넌트**
- 지도 초기화 로직과 마커 렌더링 로직 분리
- 지도 초기화는 컴포넌트 마운트 시 일회만 실행
- 마커 렌더링은 venues 및 selectedVenueId 변경 시마다 실행

**Day 필터 반응성 개선**
- 지도 페이지에서 Day 필터 변경 시 마커가 즉시 업데이트됨
- 경로 폴리라인도 실시간으로 업데이트되어 사용자 경험 향상

**사용자 위치 마커**
- 사용자 위치 마커가 독립적으로 업데이트되어 항상 최신 위치 표시

### 추가됨

지도 기능 (commit 36c76a0)
- Leaflet + OpenStreetMap으로 지도 교체
- API 키가 필요 없는 오픈소스 지도 사용
- GCJ-02 좌표계를 WGS84로 자동 변환
- 이전 바이두 맵에서의 복잡한 설정 불필요

## [0.1.0] - 2026-02-15

### 추가됨

상하이 여행 가이드 PWA 애플리케이션 초기 구현

**핵심 기능**
- Day별 여행 일정 관리 (Day1, Day2, Day3)
- 각 Day별 상세 일정 및 장소 정보 페이지
- 지도 기능 (바이두 맵)
- 장소 상세 정보 페이지
- 여행 팁 (공항, 결제, 야경 등)

**기술 기능**
- Next.js 15 App Router 기반 구조
- Zustand를 이용한 상태 관리 (Day 필터, 카테고리 필터)
- Tailwind CSS를 이용한 반응형 디자인
- TypeScript를 이용한 타입 안전성
- Vitest를 이용한 테스트 환경
- PWA 지원 (Service Worker, 오프라인 모드)

**컴포넌트 구조**
- 레이아웃: 상단 헤더, 하단 네비게이션, 메인 콘텐츠
- 네비게이션: Day 탭, 하단 탭 (Home, Map, Tips, Settings)
- 지도: 바이두 맵, Day 필터, 카테고리 필터
- 장소: 카드형 일정, 상세 정보, 메뉴, 비용 표시

**데이터 구조**
- 장소 데이터: 3일 일정 (Day1, Day2, Day3)
- 각 장소: ID, 이름, 주소, 주소 코드, 영업시간, 이미지, 메뉴, 비용, 평가

**테스트**
- 컴포넌트 단위 테스트 (74 테스트 통과)
- 통화 표시, 경고 배지 등 주요 컴포넌트 테스트

---

## 버전 관리 정책

- **메이저 버전 (Major)**: 주요 기능 추가 또는 API 변경
- **마이너 버전 (Minor)**: 새로운 기능 추가 (하위 호환성 유지)
- **패치 버전 (Patch)**: 버그 수정 및 작은 개선

## 알려진 문제

없음

## 향후 계획

- 더 많은 도시 지원 (베이징, 시안, 항저우 등)
- 음성 가이드 기능
- AR을 이용한 길찾기
- 사용자 후기 시스템
- 정보 공유 및 협업 기능
