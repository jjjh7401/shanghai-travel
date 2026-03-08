import { describe, it, expect } from "vitest";
import { generateDeepLink } from "../deeplink";

describe("deeplink utility", () => {
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
});
