import { describe, it, expect } from "vitest";
import { venues, getVenuesByDay, getVenueById } from "../venues";

describe("venues data", () => {
  describe("데이터 완전성 검증", () => {
    it("총 37개의 장소가 있다", () => {
      expect(venues).toHaveLength(37);
    });

    it("각 장소는 id를 가진다", () => {
      venues.forEach((venue) => {
        expect(venue.id).toBeTruthy();
        expect(typeof venue.id).toBe("string");
      });
    });

    it("각 장소는 한국어 이름을 가진다", () => {
      venues.forEach((venue) => {
        expect(venue.name.ko).toBeTruthy();
        expect(typeof venue.name.ko).toBe("string");
      });
    });

    it("각 장소는 중국어 이름을 가진다 (일부 예외 가능)", () => {
      const venuesWithZhName = venues.filter(
        (v) => v.name.zh && v.name.zh.length > 0
      );
      expect(venuesWithZhName.length).toBeGreaterThan(20);
    });

    it("각 장소는 유효한 카테고리를 가진다", () => {
      const validCategories = [
        "restaurant",
        "cafe",
        "attraction",
        "shopping",
        "transport",
        "nightview",
      ];
      venues.forEach((venue) => {
        expect(validCategories).toContain(venue.category);
      });
    });

    it("각 장소는 dayNumber(1, 2, 3)를 가진다", () => {
      venues.forEach((venue) => {
        expect([1, 2, 3]).toContain(venue.dayNumber);
      });
    });

    it("각 장소는 좌표(lat, lng)를 가진다", () => {
      venues.forEach((venue) => {
        expect(venue.coordinates).toBeDefined();
        expect(typeof venue.coordinates.lat).toBe("number");
        expect(typeof venue.coordinates.lng).toBe("number");
        expect(venue.coordinates.lat).toBeGreaterThan(30);
        expect(venue.coordinates.lng).toBeGreaterThan(120);
      });
    });
  });

  describe("Day 1 장소 (12개)", () => {
    it("Day 1에 12개의 장소가 있다", () => {
      const day1Venues = getVenuesByDay(1);
      expect(day1Venues).toHaveLength(12);
    });

    it("점도덕이 Day 1에 포함된다", () => {
      const day1Venues = getVenuesByDay(1);
      const diandude = day1Venues.find((v) => v.id === "day1-diandude");
      expect(diandude).toBeDefined();
      expect(diandude?.name.ko).toBe("점도덕");
      expect(diandude?.name.zh).toBe("點都德");
    });

    it("와이탄이 nightview 카테고리이다", () => {
      const day1Venues = getVenuesByDay(1);
      const bund = day1Venues.find((v) => v.id === "day1-bund");
      expect(bund?.category).toBe("nightview");
    });

    it("라오지우예에 danger 경고가 있다", () => {
      const day1Venues = getVenuesByDay(1);
      const laojiu = day1Venues.find((v) => v.id === "day1-laojiu");
      expect(laojiu?.warnings).toBeDefined();
      expect(laojiu?.warnings?.length).toBeGreaterThan(0);
      expect(laojiu?.warnings?.[0].severity).toBe("danger");
    });

    it("동북사계교자왕 비용이 94 CNY이다", () => {
      const day1Venues = getVenuesByDay(1);
      const dongbei = day1Venues.find((v) => v.id === "day1-dongbei");
      expect(dongbei?.costEstimate?.totalCNY).toBe(94);
      expect(dongbei?.costEstimate?.totalKRW).toBe(18800);
    });
  });

  describe("Day 2 장소 (17개)", () => {
    it("Day 2에 17개의 장소가 있다", () => {
      const day2Venues = getVenuesByDay(2);
      expect(day2Venues).toHaveLength(17);
    });

    it("상하이타워가 예약 정보를 가진다", () => {
      const day2Venues = getVenuesByDay(2);
      const tower = day2Venues.find((v) => v.id === "day2-shanghai-tower");
      expect(tower?.reservationInfo).toBeDefined();
      expect(tower?.reservationInfo?.platform).toBe("wechat");
      expect(tower?.reservationInfo?.required).toBe(true);
    });

    it("황푸강 페리 비용이 2 CNY이다", () => {
      const day2Venues = getVenuesByDay(2);
      const ferry = day2Venues.find((v) => v.id === "day2-ferry");
      expect(ferry?.costEstimate?.totalCNY).toBe(2);
    });
  });

  describe("Day 3 장소 (8개)", () => {
    it("Day 3에 8개의 장소가 있다", () => {
      const day3Venues = getVenuesByDay(3);
      expect(day3Venues).toHaveLength(8);
    });

    it("젤네일이 따종 앱 예약 정보를 가진다", () => {
      const day3Venues = getVenuesByDay(3);
      const nail = day3Venues.find((v) => v.id === "day3-nail");
      expect(nail?.reservationInfo).toBeDefined();
      expect(nail?.reservationInfo?.platform).toBe("dianping");
    });
  });

  describe("getVenueById", () => {
    it("ID로 장소를 찾는다", () => {
      const venue = getVenueById("day1-diandude");
      expect(venue).toBeDefined();
      expect(venue?.name.ko).toBe("점도덕");
    });

    it("존재하지 않는 ID는 undefined를 반환한다", () => {
      const venue = getVenueById("non-existent-id");
      expect(venue).toBeUndefined();
    });
  });

  describe("AliPay 경고 관련", () => {
    it("200 CNY 초과 장소들이 있다", () => {
      const expensiveVenues = venues.filter(
        (v) => v.costEstimate && v.costEstimate.totalCNY > 200
      );
      expect(expensiveVenues.length).toBeGreaterThan(0);
    });

    it("라오지우예 비용이 200 CNY를 초과한다", () => {
      const laojiu = getVenueById("day1-laojiu");
      expect(laojiu?.costEstimate?.totalCNY).toBeGreaterThan(200);
    });
  });
});
