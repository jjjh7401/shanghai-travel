import { describe, it, expect } from "vitest";
import { venues, getVenuesByDay, getVenueById } from "../venues";

describe("venues data", () => {
  describe("데이터 완전성 검증", () => {
    it("총 22개의 장소가 있다", () => {
      expect(venues).toHaveLength(22);
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
      expect(venuesWithZhName.length).toBeGreaterThan(15);
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

  describe("Day 1 장소 (5개)", () => {
    it("Day 1에 5개의 장소가 있다", () => {
      const day1Venues = getVenuesByDay(1);
      expect(day1Venues).toHaveLength(5);
    });

    it("지다오 상하이차이가 Day 1 첫 번째 장소이다", () => {
      const day1Venues = getVenuesByDay(1);
      const jidao = day1Venues.find((v) => v.id === "day1-jidao");
      expect(jidao).toBeDefined();
      expect(jidao?.name.ko).toBe("지다오 상하이차이");
      expect(jidao?.order).toBe(1);
    });

    it("왕츠핀취이가 Day 1 4번째 장소이다", () => {
      const day1Venues = getVenuesByDay(1);
      const wangchi = day1Venues.find((v) => v.id === "day1-wangchi");
      expect(wangchi).toBeDefined();
      expect(wangchi?.category).toBe("restaurant");
      expect(wangchi?.order).toBe(4);
    });

    it("호텔 복귀가 Day 1 마지막 장소이다", () => {
      const day1Venues = getVenuesByDay(1);
      const hotelReturn = day1Venues.find((v) => v.id === "day1-hotel-return");
      expect(hotelReturn).toBeDefined();
      expect(hotelReturn?.category).toBe("transport");
      expect(hotelReturn?.order).toBe(5);
    });
  });

  describe("Day 2 장소 (9개)", () => {
    it("Day 2에 9개의 장소가 있다", () => {
      const day2Venues = getVenuesByDay(2);
      expect(day2Venues).toHaveLength(9);
    });

    it("허마셴성이 Day 2 첫 번째 장소이다", () => {
      const day2Venues = getVenuesByDay(2);
      const hema = day2Venues.find((v) => v.id === "day2-hema");
      expect(hema).toBeDefined();
      expect(hema?.order).toBe(1);
      expect(hema?.missionInfo?.type).toBe("ai_tech");
    });

    it("월항조루가 Day 2 3번째 장소(점심)이다", () => {
      const day2Venues = getVenuesByDay(2);
      const wolyoung = day2Venues.find((v) => v.id === "day2-wolyoung");
      expect(wolyoung).toBeDefined();
      expect(wolyoung?.order).toBe(3);
    });

    it("빙고박스가 Day 2에 포함된다", () => {
      const day2Venues = getVenuesByDay(2);
      const bingobox = day2Venues.find((v) => v.id === "day2-bingobox");
      expect(bingobox).toBeDefined();
      expect(bingobox?.category).toBe("shopping");
      expect(bingobox?.order).toBe(8);
      expect(bingobox?.missionInfo?.type).toBe("ai_tech");
    });

    it("우캉맨션이 Day 2 포토스팟으로 포함된다", () => {
      const day2Venues = getVenuesByDay(2);
      const wukang = day2Venues.find((v) => v.id === "day2-wukang-mansion");
      expect(wukang).toBeDefined();
      expect(wukang?.category).toBe("attraction");
      expect(wukang?.order).toBe(5);
      expect(wukang?.missionInfo?.type).toBe("photo");
    });

    it("전취덕이 Day 2 마지막 장소(저녁)이다", () => {
      const day2Venues = getVenuesByDay(2);
      const quanjude = day2Venues.find((v) => v.id === "day2-quanjude");
      expect(quanjude).toBeDefined();
      expect(quanjude?.order).toBe(9);
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
      const venue = getVenueById("day1-jidao");
      expect(venue).toBeDefined();
      expect(venue?.name.ko).toBe("지다오 상하이차이");
    });

    it("존재하지 않는 ID는 undefined를 반환한다", () => {
      const venue = getVenueById("non-existent-id");
      expect(venue).toBeUndefined();
    });
  });

  describe("미션 정보 검증", () => {
    it("AI 기술 미션이 있는 장소들이 있다", () => {
      const aiVenues = venues.filter(
        (v) => v.missionInfo?.type === "ai_tech"
      );
      expect(aiVenues.length).toBeGreaterThan(0);
    });

    it("허마셴성이 미션1 인증샷 장소이다", () => {
      const hema = getVenueById("day2-hema");
      expect(hema?.missionInfo?.missionNumber).toBe(1);
      expect(hema?.missionInfo?.type).toBe("ai_tech");
    });

    it("HARMAY가 소싱 미션 장소이다", () => {
      const harmay = getVenueById("day2-harmay");
      expect(harmay?.missionInfo?.type).toBe("sourcing");
      expect(harmay?.missionInfo?.missionNumber).toBe(2);
    });
  });
});
