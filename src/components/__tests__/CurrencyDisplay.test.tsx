import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CurrencyDisplay } from "../common/CurrencyDisplay";

describe("CurrencyDisplay 컴포넌트", () => {
  it("CNY와 KRW를 함께 표시한다", () => {
    render(<CurrencyDisplay cny={94} />);
    expect(screen.getByText(/94 CNY/)).toBeInTheDocument();
    expect(screen.getByText(/18,800 KRW/)).toBeInTheDocument();
  });

  it("0 CNY를 올바르게 표시한다", () => {
    render(<CurrencyDisplay cny={0} />);
    expect(screen.getByText(/0 CNY/)).toBeInTheDocument();
    expect(screen.getByText(/0 KRW/)).toBeInTheDocument();
  });

  it("인원수를 표시한다", () => {
    render(<CurrencyDisplay cny={356} persons={2} />);
    expect(screen.getByText(/2인/)).toBeInTheDocument();
  });

  it("200 CNY 초과 시 AliPay 경고를 표시한다", () => {
    render(<CurrencyDisplay cny={356} showAliPayWarning />);
    expect(
      screen.getByText(/AliPay/)
    ).toBeInTheDocument();
  });

  it("200 CNY 이하일 때 AliPay 경고를 표시하지 않는다", () => {
    render(<CurrencyDisplay cny={94} showAliPayWarning />);
    expect(screen.queryByText(/AliPay 3%/)).not.toBeInTheDocument();
  });

  it("커스텀 환율로 변환한다", () => {
    render(<CurrencyDisplay cny={100} exchangeRate={210} />);
    expect(screen.getByText(/21,000 KRW/)).toBeInTheDocument();
  });
});
