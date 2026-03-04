import { describe, it, expect } from "vitest";
import {
  generateWeChatDeepLink,
  generateDianpingDeepLink,
  generateAmapDeepLink,
  generateDeepLink,
  isDeepLinkSupported,
} from "../deeplink";

describe("deeplink utility", () => {
  describe("generateWeChatDeepLink", () => {
    it("WeChat 딥링크 URL을 생성한다", () => {
      const url = generateWeChatDeepLink();
      expect(url).toBe("weixin://");
    });

    it("검색어가 있는 WeChat 딥링크를 생성한다", () => {
      const url = generateWeChatDeepLink("朵云书院");
      expect(url).toContain("朵云书院");
    });
  });

  describe("generateDianpingDeepLink", () => {
    it("Dianping(따종) 딥링크 URL을 생성한다", () => {
      const url = generateDianpingDeepLink();
      expect(url).toBe("dianping://");
    });

    it("검색어가 있는 Dianping 딥링크를 생성한다", () => {
      const url = generateDianpingDeepLink("美甲店");
      expect(url).toContain("美甲店");
    });
  });

  describe("generateAmapDeepLink", () => {
    it("Amap 네비게이션 딥링크를 생성한다", () => {
      const url = generateAmapDeepLink(31.2244, 121.4822, "점도덕");
      expect(url).toContain("31.2244");
      expect(url).toContain("121.4822");
    });

    it("유효하지 않은 좌표에 대해 null을 반환한다", () => {
      const url = generateAmapDeepLink(NaN, NaN, "test");
      expect(url).toBeNull();
    });
  });

  describe("generateDeepLink", () => {
    it("wechat 플랫폼에 대한 딥링크를 생성한다", () => {
      const url = generateDeepLink("wechat");
      expect(url).toBe("weixin://");
    });

    it("dianping 플랫폼에 대한 딥링크를 생성한다", () => {
      const url = generateDeepLink("dianping");
      expect(url).toBe("dianping://");
    });

    it("알 수 없는 플랫폼에 대해 null을 반환한다", () => {
      const url = generateDeepLink("unknown");
      expect(url).toBeNull();
    });
  });

  describe("isDeepLinkSupported", () => {
    it("wechat 플랫폼 지원 여부를 반환한다", () => {
      expect(isDeepLinkSupported("wechat")).toBe(true);
    });

    it("dianping 플랫폼 지원 여부를 반환한다", () => {
      expect(isDeepLinkSupported("dianping")).toBe(true);
    });

    it("알 수 없는 플랫폼은 false를 반환한다", () => {
      expect(isDeepLinkSupported("unknown")).toBe(false);
    });
  });
});
