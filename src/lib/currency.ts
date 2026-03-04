// 기본 환율: 1 CNY = 200 KRW
export const DEFAULT_EXCHANGE_RATE = 200;

// AliPay 수수료 임계값 (CNY)
export const ALIPAY_FEE_THRESHOLD = 200;

// AliPay 수수료율
export const ALIPAY_FEE_RATE = 0.03;

/**
 * CNY를 KRW로 변환한다
 * @param cny - 중국 위안 금액
 * @param exchangeRate - 환율 (기본값: 200 KRW/CNY)
 * @returns 한국 원화 금액
 */
export function convertCNYtoKRW(
  cny: number,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): number {
  return Math.round(cny * exchangeRate);
}

/**
 * CNY 금액을 포맷한다
 * @param cny - 중국 위안 금액
 * @returns 포맷된 문자열 (예: "94 CNY")
 */
export function formatCNY(cny: number): string {
  return `${cny} CNY`;
}

/**
 * KRW 금액을 포맷한다
 * @param krw - 한국 원화 금액
 * @returns 포맷된 문자열 (예: "18,800 KRW")
 */
export function formatKRW(krw: number): string {
  return `${krw.toLocaleString("ko-KR")} KRW`;
}

/**
 * CNY와 KRW를 함께 포맷한다
 * @param cny - 중국 위안 금액
 * @param exchangeRate - 환율 (기본값: 200 KRW/CNY)
 * @returns 포맷된 문자열 (예: "94 CNY (~18,800 KRW)")
 */
export function formatDualCurrency(
  cny: number,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): string {
  const krw = convertCNYtoKRW(cny, exchangeRate);
  return `${cny} CNY (~${krw.toLocaleString("ko-KR")} KRW)`;
}

/**
 * AliPay 수수료 임계값 초과 여부를 확인한다
 * @param cny - 중국 위안 금액
 * @returns 임계값 초과 여부
 */
export function isOverAliPayThreshold(cny: number): boolean {
  return cny > ALIPAY_FEE_THRESHOLD;
}

/**
 * AliPay 수수료를 계산한다
 * @param cny - 중국 위안 금액
 * @returns 수수료 금액 (CNY)
 */
export function calculateAliPayFee(cny: number): number {
  if (!isOverAliPayThreshold(cny)) return 0;
  return cny * ALIPAY_FEE_RATE;
}
