# SPEC-SHARE-001: 인수 기준

## 참조

- SPEC: `SPEC-SHARE-001`

---

## 1. 인수 시나리오 (Given-When-Then)

### 시나리오 1: 일정 공유 URL 생성 [REQ-E-01, REQ-E-04]

```gherkin
Given 사용자가 Day 일정 페이지에 있고
  And 현재 조의 일정이 커스터마이즈되어 있을 때
When 사용자가 "공유" 버튼을 클릭하면
Then 시스템은 현재 ScheduleMap을 base64로 인코딩하고
  And 공유 URL을 클립보드에 복사하고
  And "링크가 복사되었습니다!" 토스트 메시지를 표시한다
```

### 시나리오 2: 공유 URL로 일정 미리보기 [REQ-E-02, REQ-S-02]

```gherkin
Given 유효한 공유 URL이 있을 때 (/schedule?v=1&d=...&g=2)
When 사용자가 해당 URL로 접속하면
Then 시스템은 URL의 데이터를 디코딩하고
  And 가져오기 미리보기 모달을 표시하고
  And Day 1, Day 2, Day 3, 맛집 카테고리별 장소 목록을 보여주고
  And "2조에서 공유된 일정입니다" 라고 출처를 표시한다
```

### 시나리오 3: 공유 일정 가져오기 [REQ-E-03]

```gherkin
Given 가져오기 미리보기 모달이 열려 있고
  And 공유 일정 데이터가 유효할 때
When 사용자가 "일정 가져오기" 버튼을 클릭하면
Then 시스템은 현재 schedules 상태를 공유 데이터로 교체하고
  And groupScheduleMap에 현재 조의 일정도 업데이트하고
  And 모달을 닫고
  And 적용 완료 토스트를 표시한다
```

### 시나리오 4: 가져오기 취소 [REQ-E-05]

```gherkin
Given 가져오기 미리보기 모달이 열려 있을 때
When 사용자가 "취소" 버튼을 클릭하면
Then 시스템은 현재 일정을 변경하지 않고
  And 모달을 닫는다
```

### 시나리오 5: 잘못된 공유 데이터 처리 [REQ-N-01, REQ-N-03]

```gherkin
Given 잘못된 형식의 공유 URL이 있을 때 (손상된 base64)
When 사용자가 해당 URL로 접속하면
Then 시스템은 "유효하지 않은 공유 링크입니다" 에러 메시지를 표시하고
  And 현재 일정을 수정하지 않는다
```

### 시나리오 6: 존재하지 않는 venue ID 처리 [REQ-N-02]

```gherkin
Given 존재하지 않는 venue ID를 포함하는 공유 데이터가 있을 때
When 시스템이 해당 데이터를 검증하면
Then 시스템은 "일부 장소를 찾을 수 없습니다" 에러를 표시하고
  And 해당 일정을 적용하지 않는다
```

### 시나리오 7: 인코딩/디코딩 라운드트립 [REQ-U-01]

```gherkin
Given 임의의 유효한 ScheduleMap이 있을 때
When encodeSchedule로 인코딩한 후 decodeSchedule로 디코딩하면
Then 원본 ScheduleMap과 동일한 데이터가 복원된다
```

### 시나리오 8: URL 버전 관리 [REQ-U-02]

```gherkin
Given 공유 URL이 생성될 때
When URL의 쿼리 파라미터를 확인하면
Then v=1 파라미터가 항상 포함되어 있다
```

### 시나리오 9: 조 미선택 상태에서 공유 [REQ-S-01]

```gherkin
Given 사용자가 조를 선택하지 않은 상태일 때 (activeGroup === null)
When 공유 버튼을 클릭하면
Then 시스템은 현재 기본 일정(schedules)을 인코딩하고
  And URL에 g 파라미터를 포함하지 않는다
```

---

## 2. 품질 게이트

### 테스트 커버리지

| 대상 파일 | 최소 커버리지 |
|-----------|--------------|
| `src/utils/scheduleShare.ts` | 95% |
| `src/components/schedule/ShareScheduleModal.tsx` | 85% |

### 단위 테스트 케이스

**scheduleShare.ts 테스트:**

1. `encodeSchedule` - 정상 ScheduleMap 인코딩
2. `encodeSchedule` - 빈 배열 포함 ScheduleMap 인코딩
3. `decodeSchedule` - 정상 디코딩
4. `decodeSchedule` - 잘못된 base64 입력 시 에러
5. `decodeSchedule` - 잘못된 JSON 입력 시 에러
6. `decodeSchedule` - 필수 키 누락 시 에러
7. `decodeSchedule` - 존재하지 않는 venue ID 포함 시 에러
8. `buildShareUrl` - URL 형식 검증 (v, d, g 파라미터)
9. `buildShareUrl` - group 미지정 시 g 파라미터 생략
10. `parseShareUrl` - 정상 URL 파싱
11. `parseShareUrl` - 잘못된 URL 시 null 반환
12. 라운드트립: encode → decode 동일성 검증

**ShareScheduleModal.tsx 테스트:**

1. 모달 열기/닫기
2. 공유 버튼 클릭 시 클립보드 복사 호출
3. 유효한 데이터로 미리보기 렌더링
4. "일정 가져오기" 클릭 시 스토어 업데이트
5. "취소" 클릭 시 상태 미변경
6. 잘못된 데이터 입력 시 에러 메시지 표시

### 비기능 요구사항 검증

| 항목 | 기준 |
|------|------|
| URL 길이 | 38개 장소 전체 포함 시 2,000자 이내 |
| 인코딩 성능 | < 50ms |
| 디코딩 성능 | < 50ms |
| 접근성 | 모달에 aria-label, 키보드 탐색 지원 |
| 모바일 반응형 | 모달이 모바일 화면에서 정상 표시 |

---

## 3. 완료 정의 (Definition of Done)

- [ ] 모든 단위 테스트 통과 (18개 이상)
- [ ] 테스트 커버리지 85% 이상
- [ ] TypeScript 타입 에러 0건
- [ ] ESLint 경고 0건
- [ ] 인코딩/디코딩 라운드트립 검증 통과
- [ ] 공유 URL이 카카오톡에서 정상 전달 가능 (수동 확인)
- [ ] PWA 환경에서 클립보드 복사 동작 확인
- [ ] 모바일 브라우저에서 모달 정상 표시 확인
