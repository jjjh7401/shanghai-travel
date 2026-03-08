import { describe, it, expect } from "vitest";
import {
  convertCNYtoKRW,
  formatDualCurrency,
  DEFAULT_EXCHANGE_RATE,
  isOverAliPayThreshold,
  ALIPAY_FEE_THRESHOLD,
  ALIPAY_FEE_RATE,
} from "../currency";

describe("currency utility", () => {
  describe("convertCNYtoKRW", () => {
    it("94 CNY를 18800 KRW로 변환한다", () => {
      expect(convertCNYtoKRW(94)).toBe(18800);
    });

    it("1 CNY를 200 KRW로 변환한다 (기본 환율)", () => {
      expect(convertCNYtoKRW(1)).toBe(200);
    });

    it("0 CNY를 0 KRW로 변환한다", () => {
      expect(convertCNYtoKRW(0)).toBe(0);
    });

    it("356 CNY를 71200 KRW로 변환한다", () => {
      expect(convertCNYtoKRW(356)).toBe(71200);
    });

    it("커스텀 환율로 변환한다", () => {
      expect(convertCNYtoKRW(100, 210)).toBe(21000);
    });

    it("소수점 CNY를 올바르게 변환한다", () => {
      expect(convertCNYtoKRW(2.5)).toBe(500);
    });
  });

  describe("formatDualCurrency", () => {
    it("94 CNY를 '94 CNY (~18,800 KRW)'로 포맷한다", () => {
      expect(formatDualCurrency(94)).toBe("94 CNY (~18,800 KRW)");
    });

    it("2 CNY를 '2 CNY (~400 KRW)'로 포맷한다", () => {
      expect(formatDualCurrency(2)).toBe("2 CNY (~400 KRW)");
    });
  });

  describe("DEFAULT_EXCHANGE_RATE", () => {
    it("기본 환율은 200이다", () => {
      expect(DEFAULT_EXCHANGE_RATE).toBe(200);
    });
  });

  describe("isOverAliPayThreshold", () => {
    it("200 CNY 이하이면 false를 반환한다", () => {
      expect(isOverAliPayThreshold(200)).toBe(false);
    });

    it("200 CNY 초과이면 true를 반환한다", () => {
      expect(isOverAliPayThreshold(201)).toBe(true);
    });

    it("356 CNY는 AliPay 임계값을 초과한다", () => {
      expect(isOverAliPayThreshold(356)).toBe(true);
    });
  });

  describe("ALIPAY_FEE_THRESHOLD", () => {
    it("AliPay 수수료 임계값은 200이다", () => {
      expect(ALIPAY_FEE_THRESHOLD).toBe(200);
    });
  });

  describe("ALIPAY_FEE_RATE", () => {
    it("AliPay 수수료율은 0.03이다", () => {
      expect(ALIPAY_FEE_RATE).toBe(0.03);
    });
  });
});
