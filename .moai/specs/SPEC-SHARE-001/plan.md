# SPEC-SHARE-001: 구현 계획

## 참조

- SPEC: `SPEC-SHARE-001`
- 관련 SPEC: `SPEC-UI-001`

---

## 1. 마일스톤

### Primary Goal: 핵심 인코딩/디코딩 로직

**대상 파일:**
- `src/utils/scheduleShare.ts` (NEW)
- `src/utils/__tests__/scheduleShare.test.ts` (NEW)

**작업 내용:**
1. `encodeSchedule(schedules, group?)` - ScheduleMap을 base64 문자열로 변환
2. `decodeSchedule(encoded)` - base64 문자열을 ScheduleMap으로 복원 + 검증
3. `buildShareUrl(schedules, group?)` - 완전한 공유 URL 생성
4. `parseShareUrl(url)` - URL에서 일정 데이터 추출
5. `validateScheduleMap(data)` - ScheduleMap 스키마 + venue ID 존재 검증
6. TDD: RED-GREEN-REFACTOR 사이클로 테스트 선행 작성

**검증 기준:**
- 정상 인코딩/디코딩 라운드트립 검증
- 잘못된 base64, 잘못된 JSON, 잘못된 스키마에 대한 에러 처리
- 존재하지 않는 venue ID 거부
- URL 길이가 2,000자 이내

### Secondary Goal: 공유/가져오기 UI

**대상 파일:**
- `src/components/schedule/ShareScheduleModal.tsx` (NEW)
- `src/components/schedule/__tests__/ShareScheduleModal.test.tsx` (NEW)
- `src/components/schedule/DayScheduleClient.tsx` (MODIFY)

**작업 내용:**
1. `ShareScheduleModal` 컴포넌트 구현
   - 공유 탭: 현재 일정 인코딩 + 클립보드 복사 + 토스트
   - 가져오기 탭: URL 입력 + 디코딩 + 미리보기 + 적용
2. `DayScheduleClient`에 공유 버튼 아이콘 추가
3. 클립보드 API fallback 처리

**검증 기준:**
- 공유 버튼 클릭 시 모달 열림
- 클립보드 복사 성공/실패 처리
- 유효하지 않은 URL 입력 시 에러 표시
- 가져오기 확인 시 스토어 업데이트

### Final Goal: URL 진입점

**대상 파일:**
- `src/app/schedule/page.tsx` (NEW)

**작업 내용:**
1. `/schedule` 라우트에서 URL 파라미터(`v`, `d`, `g`) 파싱
2. 유효한 데이터 발견 시 자동으로 가져오기 모달 표시
3. 잘못된 데이터 시 에러 안내 페이지

**검증 기준:**
- 공유 URL 접속 시 미리보기 모달 자동 표시
- 파라미터 없으면 메인 페이지로 리다이렉트

### Optional Goal: QR 코드 + Diff 표시

- QR 코드 라이브러리(`qrcode.react`) 추가
- 현재 일정과 공유 일정의 차이점 시각화

---

## 2. 기술 접근 방식

### 아키텍처 설계

```
                    ┌─────────────────────────┐
                    │   DayScheduleClient     │
                    │   [공유 버튼 추가]       │
                    └──────────┬──────────────┘
                               │ onClick
                    ┌──────────▼──────────────┐
                    │  ShareScheduleModal     │
                    │  ┌──────┐  ┌──────────┐ │
                    │  │ 공유 │  │ 가져오기 │ │
                    │  └──┬───┘  └────┬─────┘ │
                    └─────┼───────────┼───────┘
                          │           │
              ┌───────────▼───┐  ┌────▼────────────┐
              │ encodeSchedule│  │ decodeSchedule   │
              │ buildShareUrl │  │ validateSchedule │
              └───────────────┘  └─────────────────┘
                          │           │
              ┌───────────▼───┐  ┌────▼────────────┐
              │  clipboard    │  │ useScheduleStore │
              │  .writeText() │  │ .schedules = ... │
              └───────────────┘  └─────────────────┘
```

### 인코딩 전략

1. **JSON.stringify** - ScheduleMap을 JSON 문자열로 변환
2. **btoa()** - base64 인코딩 (브라우저 내장, 의존성 없음)
3. **encodeURIComponent** - URL-safe 변환
4. 예상 URL 길이: ~300-800자 (venue ID 개수에 따라)

### 왜 서버리스 API가 아닌 URL 기반인가

| 기준 | URL 기반 | API Route + KV |
|------|----------|----------------|
| 의존성 | 없음 | Vercel KV 추가 |
| 설정 | 즉시 사용 | 환경변수 설정 필요 |
| 오프라인 | 동작 | 불가 |
| 비용 | 무료 | KV 사용량 과금 |
| URL 길이 | ~800자 | 짧은 코드 가능 |
| 만료 | 없음 (영구) | TTL 설정 필요 |

결론: 20명 이하 소규모 그룹에서 URL 기반이 최적.

### 새로운 의존성

- **없음** (Phase 1은 zero dependency)
- Optional Goal에서만 `qrcode.react` 추가 고려

---

## 3. 리스크 및 대응

| 리스크 | 가능성 | 영향 | 대응 |
|--------|--------|------|------|
| URL 길이 초과 (2,000자) | Low | 일부 메신저에서 URL 잘림 | venue ID 축약 매핑 테이블 구현 |
| 클립보드 API 미지원 | Low | 복사 실패 | `document.execCommand('copy')` fallback |
| 한글/특수문자 인코딩 이슈 | Low | 디코딩 실패 | venue ID는 영문이므로 안전 |
| 구 버전 URL 호환성 | Medium | 포맷 변경 시 기존 URL 동작 불가 | `v` 파라미터로 버전 관리 |
| 대량 장소 추가로 URL 크기 증가 | Low | 현재 38개 고정 | 향후 압축 알고리즘 도입 |

---

## 4. 개발 방법론

- **TDD** (RED-GREEN-REFACTOR) - quality.yaml 설정에 따름
- 테스트 선행 작성 후 구현
- 커버리지 목표: 85% 이상
- 유틸리티 함수는 순수 함수로 구현하여 테스트 용이성 확보
