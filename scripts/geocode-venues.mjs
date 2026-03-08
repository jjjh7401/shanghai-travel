/**
 * Nominatim(OpenStreetMap) API로 중국어 주소를 지오코딩하여
 * 정확한 GCJ-02 좌표를 출력하는 스크립트
 * 실행: node scripts/geocode-venues.mjs
 */

import { setTimeout as sleep } from "timers/promises";

// 주소가 확정된 13개 장소
const venues = [
  { id: "day1-baidu-park",      address: "上海市嘉定区安亭镇安智路113号" },
  { id: "day1-deepblue",        address: "上海市长宁区威宁路369号" },
  { id: "day1-wangchi",         address: "上海市黄浦区南京西路2号 新世界城" },
  { id: "day1-hotel-return",    address: "上海市虹口区黄浦路199号" },
  { id: "day2-hema",            address: "上海市长宁区长宁路88号" },
  { id: "day2-columbia",        address: "上海市长宁区延安西路1262号" },
  { id: "day2-wolyoung",        address: "上海市黄浦区九江路600号" },
  { id: "day2-harmay",          address: "上海市徐汇区安福路322号" },
  { id: "day2-wukang-mansion",  address: "上海市徐汇区武康路99号" },
  { id: "day2-xintiandi",       address: "上海市黄浦区兴业路123弄" },
  { id: "day2-quanjude",        address: "上海市黄浦区淮海中路780号" },
  { id: "day3-taikoo",          address: "上海市浦东新区东玉路500号" },
  { id: "day3-tianzifang",      address: "上海市黄浦区泰康路210弄" },
];

// WGS84 → GCJ-02 변환
function wgs84ToGcj02(lng, lat) {
  const a = 6378245.0;
  const ee = 0.00669342162296594323;

  function transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  function transformLng(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
    return ret;
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * Math.PI);
  dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * Math.PI);

  return { lat: lat + dLat, lng: lng + dLng };
}

async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=cn`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ShanghaiTravelApp/1.0 (geocoding script)" },
    });
    const data = await res.json();
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      display: data[0].display_name,
    };
  } catch (e) {
    return null;
  }
}

console.log("=== Nominatim 지오코딩 결과 (WGS84 → GCJ-02) ===\n");

for (const venue of venues) {
  const wgs = await geocode(venue.address);
  await sleep(1200); // Nominatim 사용 정책: 1초 이상 간격

  if (!wgs) {
    console.log(`[NOT FOUND] ${venue.id} — "${venue.address}"`);
    continue;
  }

  const gcj = wgs84ToGcj02(wgs.lng, wgs.lat);
  console.log(`// ${venue.id}`);
  console.log(`// WGS84:  lat=${wgs.lat.toFixed(6)}, lng=${wgs.lng.toFixed(6)}`);
  console.log(`// 주소: ${venue.address}`);
  console.log(`coordinates: { lat: ${gcj.lat.toFixed(4)}, lng: ${gcj.lng.toFixed(4)} },`);
  console.log();
}
