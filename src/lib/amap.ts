// AMap 유틸리티 함수

/**
 * AMap 마커 옵션 타입
 */
export interface AmapMarkerOptions {
  position: [number, number]; // [lng, lat]
  title: string;
  category?: string;
}

/**
 * AMap URL을 생성한다 (웹 버전)
 */
export function generateAmapWebUrl(
  lat: number,
  lng: number,
  name: string
): string {
  return `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(
    name
  )}&src=shanghai-travel&coordinate=gaode`;
}

/**
 * AMap 앱 딥링크를 생성한다
 */
export function generateAmapAppUrl(
  lat: number,
  lng: number,
  name: string
): string {
  return `androidamap://viewMap?sourceApplication=shanghai-travel&poiname=${encodeURIComponent(
    name
  )}&lat=${lat}&lon=${lng}&dev=0`;
}

/**
 * iOS AMap 딥링크를 생성한다
 */
export function generateAmapIOSUrl(
  lat: number,
  lng: number,
  name: string
): string {
  return `iosamap://viewMap?sourceApplication=shanghai-travel&poiname=${encodeURIComponent(
    name
  )}&lat=${lat}&lon=${lng}&dev=0`;
}
