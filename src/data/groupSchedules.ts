// IBT 4개 조별 일정 정의
// Day1, Day3은 전 조 공통 / Day2는 조별 다른 루트

export type GroupNumber = 1 | 2 | 3 | 4;

export interface GroupScheduleDay {
  venueIds: string[];
  label: string;
}

export interface GroupSchedule {
  group: GroupNumber;
  name: string;
  color: string;
  days: {
    1: GroupScheduleDay;
    2: GroupScheduleDay;
    3: GroupScheduleDay;
  };
}

// Day1 공통 순서 (IBT 공식 일정)
const DAY1_COMMON: GroupScheduleDay = {
  label: "Inspiration — AI 기술 기업 방문",
  venueIds: [
    "day1-jidao",
    "day1-baidu-park",
    "day1-deepblue",
    "day1-wangchi",
    "day1-hotel-return",
  ],
};

// Day3 공통 순서 (자유 일정)
const DAY3_COMMON: GroupScheduleDay = {
  label: "Refresh — 브런치·티엔즈팡·귀국",
  venueIds: [
    "day3-jianbing",
    "day3-manner",
    "day3-lillian",
    "day3-baowang",
    "day3-tianzifang",
    "day3-mamajia",
    "day3-nail",
    "day3-taikoo",
  ],
};

export const groupSchedules: GroupSchedule[] = [
  {
    group: 1,
    name: "1조",
    color: "blue",
    days: {
      1: DAY1_COMMON,
      2: {
        label: "Networking — 스마트리테일·문화공간·쇼핑",
        venueIds: [
          "day2-hema",           // 오전: 허마셴성 AI 기술 미션
          "day2-columbia",       // 콜롬비아서클 포토미션
          "day2-wolyoung",       // 점심: 월항조루
          "day2-harmay",         // 오후: HARMAY 소싱미션
          "day2-wukang-mansion", // 우캉맨션 포토미션
          "day2-xintiandi",      // 신천지 스쿠먼 + 팝마트
          "day2-popmart",        // 남경로 팝마트 소싱
          "day2-quanjude",       // 저녁: 전취덕
        ],
      },
      3: DAY3_COMMON,
    },
  },
  {
    group: 2,
    name: "2조",
    color: "green",
    days: {
      1: DAY1_COMMON,
      2: {
        label: "Networking — 문화공간·뷰티·쇼핑·AI체험",
        venueIds: [
          "day2-columbia",       // 오전: 콜롬비아서클 포토미션
          "day2-hema",           // 허마셴성 AI 기술 미션
          "day2-wolyoung",       // 점심: 월항조루
          "day2-xintiandi",      // 오후: 신천지 스쿠먼 + 팝마트
          "day2-popmart",        // 남경로 팝마트 소싱
          "day2-harmay",         // HARMAY 소싱미션
          "day2-bingobox",       // 빙고박스 무인편의점 체험
          "day2-quanjude",       // 저녁: 전취덕
        ],
      },
      3: DAY3_COMMON,
    },
  },
  {
    group: 3,
    name: "3조",
    color: "orange",
    days: {
      1: DAY1_COMMON,
      2: {
        label: "Networking — 뷰티편집숍·역사건물·쇼핑·AI",
        venueIds: [
          "day2-harmay",         // 오전: HARMAY 소싱미션
          "day2-wukang-mansion", // 우캉맨션 포토미션
          "day2-wolyoung",       // 점심: 월항조루
          "day2-hema",           // 오후: 허마셴성 AI 기술 미션
          "day2-bingobox",       // 빙고박스 무인편의점 체험
          "day2-columbia",       // 콜롬비아서클 포토미션
          "day2-xintiandi",      // 신천지 스쿠먼 + 팝마트
          "day2-quanjude",       // 저녁: 전취덕
        ],
      },
      3: DAY3_COMMON,
    },
  },
  {
    group: 4,
    name: "4조",
    color: "purple",
    days: {
      1: DAY1_COMMON,
      2: {
        label: "Networking — 쇼핑·문화거리·AI·뷰티",
        venueIds: [
          "day2-xintiandi",      // 오전: 신천지 스쿠먼 + 팝마트
          "day2-popmart",        // 남경로 팝마트 소싱
          "day2-wolyoung",       // 점심: 월항조루
          "day2-columbia",       // 오후: 콜롬비아서클 포토미션
          "day2-hema",           // 허마셴성 AI 기술 미션
          "day2-wukang-mansion", // 우캉맨션 포토미션
          "day2-harmay",         // HARMAY 소싱미션
          "day2-quanjude",       // 저녁: 전취덕
        ],
      },
      3: DAY3_COMMON,
    },
  },
];

export function getGroupSchedule(group: GroupNumber): GroupSchedule {
  const schedule = groupSchedules.find((s) => s.group === group);
  if (!schedule) throw new Error(`Invalid group: ${group}`);
  return schedule;
}

export function getGroupDayVenueIds(
  group: GroupNumber,
  day: 1 | 2 | 3
): string[] {
  return getGroupSchedule(group).days[day].venueIds;
}
