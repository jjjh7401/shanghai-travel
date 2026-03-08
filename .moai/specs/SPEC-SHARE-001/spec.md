# SPEC-SHARE-001: 일정 공유 (Schedule Share)

## 메타데이터

| 항목 | 값 |
|------|-----|
| SPEC ID | SPEC-SHARE-001 |
| 제목 | Schedule Share - URL 기반 일정 공유 |
| 생성일 | 2026-03-08 |
| 상태 | Planned |
| 우선순위 | High |
| 라이프사이클 | spec-first |

---

## 1. 환경 (Environment)

### 프로젝트 컨텍스트

- **프레임워크**: Next.js 15 App Router + TypeScript
- **상태관리**: Zustand (persist 미들웨어, localStorage)
- **배포**: Vercel (서버리스)
- **PWA**: 오프라인 고려 필요
- **동시 사용자**: 최대 ~20명 (소규모 여행 그룹)
- **데이터**: 38개 장소, 4개 조, Day 1/2/3 + food 카테고리

### 현재 아키텍처

- `useScheduleStore` (Zustand): `ScheduleMap` = `{ 1: string[], 2: string[], 3: string[], food: string[] }`
- `activeGroup: GroupNumber | null` (1 | 2 | 3 | 4)
- `groupScheduleMap: Partial<Record<GroupNumber, ScheduleMap>>` - 조별 커스텀 일정
- 모든 데이터는 localStorage에만 저장 (키: `shanghai-schedule`)
- 백엔드 없음, 외부 서비스 미설치

### 기술 제약

- 새로운 백엔드 서비스 추가 불가 (Phase 1)
- 외부 DB/BaaS 의존성 없음
- URL 길이 제한: 브라우저별 2,000~8,000자 (실질적으로 2,000자 이내 권장)
- base64 인코딩 시 33% 크기 증가 고려

---

## 2. 가정 (Assumptions)

| ID | 가정 | 신뢰도 | 근거 | 틀릴 경우 위험 |
|----|------|--------|------|----------------|
| A1 | venue ID는 짧은 문자열 (예: "d1-pudong-airport") | High | venues.ts 데이터 확인 | URL 길이 초과 |
| A2 | 일정 데이터 (4개 배열의 venue ID)는 압축 후 URL-safe 길이에 맞음 | Medium | 38개 장소 ID, 평균 15자 = ~570자 → base64 ~760자 | 단축 URL 서비스 또는 API route 필요 |
| A3 | 같은 조 멤버끼리 공유하는 시나리오가 주 사용 케이스 | High | 4개 조 구성 | 조 간 공유 시 혼란 가능 |
| A4 | 클립보드 API가 PWA 환경에서 동작 | High | navigator.clipboard은 HTTPS에서 지원 | 수동 복사 fallback 필요 |
| A5 | 사용자가 공유 URL을 메신저(카카오톡 등)로 전달 | High | 여행 그룹 특성 | 다른 공유 채널 고려 |

---

## 3. 요구사항 (Requirements)

### 3.1 유비쿼터스 요구사항 (Ubiquitous)

- **[REQ-U-01]** 시스템은 **항상** 유효한 `ScheduleMap` 구조(`1`, `2`, `3`, `food` 키와 각각 `string[]` 값)만 인코딩/디코딩해야 한다.
- **[REQ-U-02]** 시스템은 **항상** 공유 URL에 버전 정보(`v=1`)를 포함하여 향후 포맷 변경에 대비해야 한다.

### 3.2 이벤트 기반 요구사항 (Event-Driven)

- **[REQ-E-01]** **WHEN** 사용자가 공유 버튼을 클릭하면 **THEN** 시스템은 현재 일정을 인코딩하여 공유 URL을 클립보드에 복사해야 한다.
- **[REQ-E-02]** **WHEN** 공유 URL이 열리면 **THEN** 시스템은 일정 데이터를 디코딩하여 가져오기 미리보기 모달을 표시해야 한다.
- **[REQ-E-03]** **WHEN** 사용자가 "일정 가져오기" 버튼을 클릭하면 **THEN** 시스템은 공유된 일정을 현재 조의 일정에 적용해야 한다.
- **[REQ-E-04]** **WHEN** 클립보드 복사가 성공하면 **THEN** 시스템은 "링크가 복사되었습니다!" 토스트 메시지를 표시해야 한다.
- **[REQ-E-05]** **WHEN** 사용자가 가져오기 모달에서 "취소"를 클릭하면 **THEN** 시스템은 현재 일정을 변경하지 않고 모달을 닫아야 한다.

### 3.3 상태 기반 요구사항 (State-Driven)

- **[REQ-S-01]** **IF** 사용자가 조를 선택하지 않은 상태에서 공유 버튼을 누르면 **THEN** 시스템은 기본 일정을 인코딩해야 한다.
- **[REQ-S-02]** **IF** 공유 URL에 조 번호(`g`)가 포함되어 있으면 **THEN** 미리보기 모달에 출처 조 번호를 표시해야 한다.

### 3.4 비원하는 동작 요구사항 (Unwanted Behavior)

- **[REQ-N-01]** 시스템은 유효하지 않은 일정 데이터로 현재 일정을 수정**하지 않아야 한다**.
- **[REQ-N-02]** 시스템은 존재하지 않는 venue ID를 포함하는 일정을 적용**하지 않아야 한다**.
- **[REQ-N-03]** 시스템은 디코딩 실패 시 사용자에게 오류를 숨기**지 않아야 한다** (명확한 에러 메시지 표시).

### 3.5 선택적 요구사항 (Optional)

- **[REQ-O-01]** **가능하면** 시스템은 공유 URL을 QR 코드로도 표시하는 기능을 제공한다.
- **[REQ-O-02]** **가능하면** 시스템은 가져오기 전 현재 일정과 공유 일정의 차이점(diff)을 표시한다.

---

## 4. 명세 (Specifications)

### 4.1 데이터 흐름

```
[공유 흐름]
useScheduleStore.schedules (ScheduleMap)
  → JSON.stringify()
  → TextEncoder → Uint8Array
  → 커스텀 경량 압축 (반복 ID 제거)
  → btoa() (base64)
  → URL-safe 인코딩 (encodeURIComponent)
  → URL 생성: {origin}/schedule?v=1&d={data}&g={group}
  → navigator.clipboard.writeText()
  → 토스트: "링크가 복사되었습니다!"

[가져오기 흐름]
URL 파라미터 파싱 (?v=1&d=...&g=...)
  → decodeURIComponent
  → atob() (base64 디코딩)
  → JSON.parse()
  → ScheduleMap 스키마 검증
  → venue ID 존재 검증 (getVenueById)
  → 미리보기 모달 표시 (Day별 장소 목록)
  → 사용자 확인 → schedules 상태 업데이트
```

### 4.2 URL 스키마

```
https://{hostname}/schedule?v=1&d={encodedData}&g={groupNumber}
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `v` | number | Y | 포맷 버전 (현재 `1`) |
| `d` | string | Y | base64 인코딩된 ScheduleMap JSON |
| `g` | number | N | 출처 조 번호 (1-4) |

### 4.3 인코딩/디코딩 로직

```typescript
// 인코딩
function encodeSchedule(schedules: ScheduleMap, group?: GroupNumber): string

// 디코딩 + 검증
function decodeSchedule(encoded: string): {
  success: true;
  data: ScheduleMap;
} | {
  success: false;
  error: string;
}

// URL 생성
function buildShareUrl(schedules: ScheduleMap, group?: GroupNumber): string

// URL 파싱
function parseShareUrl(url: string): {
  version: number;
  data: ScheduleMap;
  group?: GroupNumber;
} | null
```

### 4.4 검증 규칙

1. `ScheduleMap`은 반드시 `1`, `2`, `3`, `food` 키를 가져야 한다
2. 각 값은 `string[]` 타입이어야 한다
3. 모든 venue ID는 `getVenueById(id)`로 존재 확인
4. 버전 번호가 지원 범위 내 (현재 `v=1`만)
5. base64 디코딩 실패 시 graceful error 처리

### 4.5 수정 대상 파일

| 파일 | 작업 | 설명 |
|------|------|------|
| `src/utils/scheduleShare.ts` | **NEW** | 인코딩/디코딩/URL 빌드/파싱 유틸리티 |
| `src/components/schedule/ShareScheduleModal.tsx` | **NEW** | 공유/가져오기 UI 모달 |
| `src/components/schedule/DayScheduleClient.tsx` | **MODIFY** | 공유 버튼 추가 |
| `src/app/schedule/page.tsx` | **NEW** | 공유 URL 진입점 (URL 파라미터 처리) |
| `src/utils/__tests__/scheduleShare.test.ts` | **NEW** | 인코딩/디코딩 단위 테스트 |
| `src/components/schedule/__tests__/ShareScheduleModal.test.tsx` | **NEW** | 모달 컴포넌트 테스트 |

### 4.6 컴포넌트 구조

```
ShareScheduleModal
  ├── 공유 탭 (ShareTab)
  │   ├── "일정 공유하기" 버튼 → 클립보드 복사
  │   └── 복사 완료 토스트
  └── 가져오기 탭 (ImportTab)
      ├── URL/코드 입력 필드
      ├── 미리보기: Day별 장소 목록
      ├── 출처 조 번호 표시
      ├── "일정 가져오기" 확인 버튼
      └── "취소" 버튼
```

---

## 5. 추적성 (Traceability)

| 요구사항 | 구현 파일 | 테스트 |
|----------|-----------|--------|
| REQ-U-01 | `scheduleShare.ts` | `scheduleShare.test.ts` |
| REQ-U-02 | `scheduleShare.ts` | `scheduleShare.test.ts` |
| REQ-E-01 | `ShareScheduleModal.tsx`, `DayScheduleClient.tsx` | `ShareScheduleModal.test.tsx` |
| REQ-E-02 | `schedule/page.tsx`, `ShareScheduleModal.tsx` | `ShareScheduleModal.test.tsx` |
| REQ-E-03 | `ShareScheduleModal.tsx` | `ShareScheduleModal.test.tsx` |
| REQ-E-04 | `ShareScheduleModal.tsx` | `ShareScheduleModal.test.tsx` |
| REQ-E-05 | `ShareScheduleModal.tsx` | `ShareScheduleModal.test.tsx` |
| REQ-S-01 | `scheduleShare.ts` | `scheduleShare.test.ts` |
| REQ-S-02 | `ShareScheduleModal.tsx` | `ShareScheduleModal.test.tsx` |
| REQ-N-01 | `scheduleShare.ts` | `scheduleShare.test.ts` |
| REQ-N-02 | `scheduleShare.ts` | `scheduleShare.test.ts` |
| REQ-N-03 | `ShareScheduleModal.tsx` | `ShareScheduleModal.test.tsx` |
