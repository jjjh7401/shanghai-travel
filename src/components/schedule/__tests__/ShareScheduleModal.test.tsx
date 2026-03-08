import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareScheduleModal } from "../ShareScheduleModal";

// Zustand persist 미들웨어 bypass
vi.mock("zustand/middleware", async (importOriginal) => {
  const actual = await importOriginal<typeof import("zustand/middleware")>();
  return {
    ...actual,
    persist:
      (fn: Parameters<typeof actual.persist>[0]) =>
      (...args: unknown[]) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fn as (...a: unknown[]) => unknown)(...args),
  };
});

// useGroupStore mock: selectedGroup을 1로 설정
vi.mock("@/store/useGroupStore", () => ({
  useGroupStore: () => ({
    selectedGroup: 1,
    hasSelectedGroup: true,
    setGroup: vi.fn(),
    resetGroup: vi.fn(),
  }),
}));

// fetch mock
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("ShareScheduleModal 컴포넌트", () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
    mockFetch.mockClear();
  });

  it("open=true일 때 렌더링된다", () => {
    render(<ShareScheduleModal isOpen={true} onClose={onCloseMock} />);
    expect(screen.getByText("일정 공유")).toBeInTheDocument();
  });

  it("open=false일 때 렌더링되지 않는다", () => {
    render(<ShareScheduleModal isOpen={false} onClose={onCloseMock} />);
    expect(screen.queryByText("일정 공유")).not.toBeInTheDocument();
  });

  it("기본적으로 업로드 탭이 표시된다", () => {
    render(<ShareScheduleModal isOpen={true} onClose={onCloseMock} />);
    expect(screen.getByText("현재 일정 업로드")).toBeInTheDocument();
  });

  it("가져오기 탭 클릭 시 조 선택 UI가 표시된다", () => {
    render(<ShareScheduleModal isOpen={true} onClose={onCloseMock} />);
    // 탭 영역에서 첫 번째 "가져오기" 탭 클릭 (헤더 탭)
    const tabs = screen.getAllByRole("button", { name: "가져오기" });
    fireEvent.click(tabs[0]);
    expect(screen.getByText("어느 조의 일정을 가져올까요?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1조" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4조" })).toBeInTheDocument();
  });

  it("오버레이 클릭 시 onClose가 호출된다", () => {
    render(<ShareScheduleModal isOpen={true} onClose={onCloseMock} />);
    const overlay = document.querySelector(".fixed.inset-0");
    if (overlay) {
      fireEvent.click(overlay);
    }
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("닫기 버튼 클릭 시 onClose가 호출된다", () => {
    render(<ShareScheduleModal isOpen={true} onClose={onCloseMock} />);
    const closeButton = screen.getByLabelText("닫기");
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("업로드 성공 시 완료 메시지가 표시된다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, message: "일정이 업로드되었습니다." }),
    });

    render(<ShareScheduleModal isOpen={true} onClose={onCloseMock} />);
    const uploadButton = screen.getByText("현재 일정 업로드");
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/업로드 완료/)).toBeInTheDocument();
    });
  });

  it("DB 미설정 시 503 응답에서 준비 중 메시지가 표시된다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: "데이터베이스가 설정되지 않았습니다." }),
    });

    render(<ShareScheduleModal isOpen={true} onClose={onCloseMock} />);
    const uploadButton = screen.getByText("현재 일정 업로드");
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/서비스 준비 중/)).toBeInTheDocument();
    });
  });

  it("가져오기 탭에서 조 미선택 시 가져오기 실행 버튼이 비활성화된다", () => {
    render(<ShareScheduleModal isOpen={true} onClose={onCloseMock} />);
    const tabs = screen.getAllByRole("button", { name: "가져오기" });
    fireEvent.click(tabs[0]);

    // 가져오기 탭에서 두 번째 버튼이 실행 버튼
    const allButtons = screen.getAllByRole("button", { name: "가져오기" });
    const execButton = allButtons[allButtons.length - 1];
    expect(execButton).toBeDisabled();
  });

  it("가져오기 탭에서 일정 없을 경우 오류 메시지 표시", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: null, message: "저장된 일정이 없습니다." }),
    });

    render(<ShareScheduleModal isOpen={true} onClose={onCloseMock} />);
    const tabs = screen.getAllByRole("button", { name: "가져오기" });
    fireEvent.click(tabs[0]);

    const group1Button = screen.getByRole("button", { name: "1조" });
    fireEvent.click(group1Button);

    // 실행 버튼 클릭
    const allButtons = screen.getAllByRole("button", { name: "가져오기" });
    const execButton = allButtons[allButtons.length - 1];
    fireEvent.click(execButton);

    await waitFor(() => {
      expect(screen.getByText(/저장된 일정이 없습니다/)).toBeInTheDocument();
    });
  });
});
