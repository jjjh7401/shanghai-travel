// WeChat 유틸리티 함수

/**
 * WeChat 앱 딥링크를 생성한다
 */
export function generateWeChatAppUrl(searchQuery?: string): string {
  if (searchQuery) {
    return `weixin://dl/search?query=${searchQuery}`;
  }
  return "weixin://";
}

/**
 * WeChat 미니앱 딥링크를 생성한다
 */
export function generateWeChatMiniAppUrl(appId: string, path: string): string {
  return `weixin://dl/business/?t=${appId}&scene=${encodeURIComponent(path)}`;
}

/**
 * WeChat 공유 텍스트를 생성한다
 */
export function generateWeChatShareText(
  venueName: string,
  address: string
): string {
  return `${venueName}\n주소: ${address}\n(상하이 여행 가이드 앱에서 공유됨)`;
}
