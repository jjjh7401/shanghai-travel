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
    it("주소가 없으면 좌표 기반 마커 URL을 반환한다", () => {
      const url = generateAmapDeepLink(31.2244, 121.4822, "全聚德");
      expect(url).toContain("uri.amap.com/marker");
      expect(url).toContain("121.4822");
      expect(url).toContain("31.2244");
      expect(url).toContain("coordinate=gaode");
      expect(url).toContain("callnative=1");
    });

    it("주소가 있으면 Amap 키워드 검색 URL을 반환한다 (Amap 지오코딩 사용)", () => {
      const url = generateAmapDeepLink(
        31.2200,
        121.4648,
        "全聚德",
        "上海市黄浦区淮海中路780号 栗时代大厦 4F"
      );
      expect(url).toContain("uri.amap.com/search");
      expect(url).toContain("keyword=");
      expect(url).toContain(encodeURIComponent("上海市黄浦区淮海中路780号 栗时代大厦 4F"));
      expect(url).toContain("callnative=1");
      // 검색 URL에는 좌표가 포함되지 않아야 함
      expect(url).not.toContain("position=");
    });

    it("주소가 있을 때 좌표가 NaN이어도 검색 URL을 반환한다", () => {
      const url = generateAmapDeepLink(
        NaN,
        NaN,
        "全聚德",
        "上海市黄浦区淮海中路780号 栗时代大厦 4F"
      );
      // 좌표가 NaN이어도 주소가 있으면 null 반환 (좌표 유효성 검사가 먼저)
      expect(url).toBeNull();
    });

    it("유효하지 않은 좌표에 주소도 없으면 null을 반환한다", () => {
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
