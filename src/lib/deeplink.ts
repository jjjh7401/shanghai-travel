// 지원되는 플랫폼 타입
export type DeepLinkPlatform = "wechat" | "dianping" | "amap";

// 지원 플랫폼 목록
const SUPPORTED_PLATFORMS: DeepLinkPlatform[] = ["wechat", "dianping", "amap"];

/**
 * WeChat 딥링크 URL을 생성한다
 * @param searchQuery - 검색어 (선택사항)
 * @returns WeChat 딥링크 URL
 */
export function generateWeChatDeepLink(searchQuery?: string): string {
  if (searchQuery) {
    return `weixin://search?query=${searchQuery}`;
  }
  return "weixin://";
}

/**
 * Dianping(따종) 딥링크 URL을 생성한다
 * @param searchQuery - 검색어 (선택사항)
 * @returns Dianping 딥링크 URL
 */
export function generateDianpingDeepLink(searchQuery?: string): string {
  if (searchQuery) {
    return `dianping://search?keyword=${searchQuery}`;
  }
  return "dianping://";
}

/**
 * Amap(高德地图) 위치 딥링크를 생성한다.
 * 중국어 주소가 있으면 Amap 키워드 검색 URL을 사용해 Amap 자체 지오코딩으로 정확한 위치를 찾는다.
 * 주소가 없으면 GCJ-02 좌표 기반 마커 URL로 폴백한다.
 * @param lat - 위도 (GCJ-02, 폴백용)
 * @param lng - 경도 (GCJ-02, 폴백용)
 * @param name - 장소명
 * @param address - 중국어 전체 주소 (건물·층수 포함, 선택사항)
 * @returns Amap 딥링크 URL 또는 null (유효하지 않은 좌표)
 */
export function generateAmapDeepLink(
  lat: number,
  lng: number,
  name: string,
  address?: string
): string | null {
  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }
  // 중국어 주소가 있으면 Amap 키워드 검색 사용 (Amap 자체 지오코딩 → 빌딩 수준 정확도)
  if (address) {
    return `https://uri.amap.com/search?keyword=${encodeURIComponent(address)}&city=%E4%B8%8A%E6%B5%B7&src=shanghai-travel&callnative=1`;
  }
  // 주소 없음 → 좌표 기반 마커로 폴백
  return `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(name)}&src=shanghai-travel&coordinate=gaode&callnative=1`;
}

/**
 * 플랫폼에 맞는 딥링크를 생성한다
 * @param platform - 플랫폼 문자열
 * @param options - 추가 옵션
 * @returns 딥링크 URL 또는 null
 */
export function generateDeepLink(
  platform: string,
  options?: {
    searchQuery?: string;
    lat?: number;
    lng?: number;
    name?: string;
    address?: string;
  }
): string | null {
  switch (platform) {
    case "wechat":
      return generateWeChatDeepLink(options?.searchQuery);
    case "dianping":
      return generateDianpingDeepLink(options?.searchQuery);
    case "amap":
      if (
        options?.lat !== undefined &&
        options?.lng !== undefined &&
        options?.name
      ) {
        return generateAmapDeepLink(
          options.lat,
          options.lng,
          options.name,
          options.address
        );
      }
      return null;
    default:
      return null;
  }
}

/**
 * 플랫폼 딥링크 지원 여부를 확인한다
 * @param platform - 플랫폼 문자열
 * @returns 지원 여부
 */
export function isDeepLinkSupported(platform: string): boolean {
  return SUPPORTED_PLATFORMS.includes(platform as DeepLinkPlatform);
}
