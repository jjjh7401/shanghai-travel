"use client";

import {
  convertCNYtoKRW,
  isOverAliPayThreshold,
  ALIPAY_FEE_THRESHOLD,
  DEFAULT_EXCHANGE_RATE,
} from "@/lib/currency";

interface CurrencyDisplayProps {
  cny: number;
  persons?: number;
  exchangeRate?: number;
  showAliPayWarning?: boolean;
  className?: string;
}

/**
 * CNY와 KRW를 동시에 표시하는 컴포넌트
 */
export function CurrencyDisplay({
  cny,
  persons,
  exchangeRate = DEFAULT_EXCHANGE_RATE,
  showAliPayWarning = false,
  className = "",
}: CurrencyDisplayProps) {
  const krw = convertCNYtoKRW(cny, exchangeRate);
  const showWarning = showAliPayWarning && isOverAliPayThreshold(cny);

  return (
    <div className={`currency-display ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{cny} CNY</span>
        <span className="text-gray-500 text-sm">
          (~{krw.toLocaleString("ko-KR")} KRW)
        </span>
        {persons && (
          <span className="text-xs text-gray-400">({persons}인 기준)</span>
        )}
      </div>
      {showWarning && (
        <div className="mt-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
          200위안 초과 시 AliPay 3% 수수료 발생 ({ALIPAY_FEE_THRESHOLD} CNY
          초과)
        </div>
      )}
    </div>
  );
}
