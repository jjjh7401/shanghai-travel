import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WarningBadge } from "../common/WarningBadge";

describe("WarningBadge 컴포넌트", () => {
  it("danger 심각도로 렌더링된다", () => {
    render(<WarningBadge severity="danger" content="위험한 경고 메시지" />);
    const element = screen.getByText("위험한 경고 메시지");
    expect(element).toBeInTheDocument();
  });

  it("caution 심각도로 렌더링된다", () => {
    render(<WarningBadge severity="caution" content="주의 메시지" />);
    const element = screen.getByText("주의 메시지");
    expect(element).toBeInTheDocument();
  });

  it("danger일 때 빨간 배경 클래스를 가진다", () => {
    const { container } = render(
      <WarningBadge severity="danger" content="경고" />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toMatch(/red|danger/i);
  });

  it("caution일 때 노란/주황 배경 클래스를 가진다", () => {
    const { container } = render(
      <WarningBadge severity="caution" content="주의" />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toMatch(/yellow|orange|caution|amber/i);
  });

  it("경고 아이콘이 표시된다", () => {
    render(<WarningBadge severity="danger" content="경고" />);
    // 경고 아이콘 역할을 하는 요소가 있는지 확인
    const element = screen.getByRole("alert");
    expect(element).toBeInTheDocument();
  });
});
