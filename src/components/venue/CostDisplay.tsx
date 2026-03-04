"use client";

import type { CostEstimate } from "@/types/venue";
import { formatDualCurrency, isOverAliPayThreshold } from "@/lib/currency";

interface CostDisplayProps {
  costEstimate: CostEstimate;
  exchangeRate?: number;
}

/**
 * 비용 표시 컴포넌트 (합계)
 */
export function CostDisplay({ costEstimate, exchangeRate = 200 }: CostDisplayProps) {
  const showAliPayWarning = isOverAliPayThreshold(costEstimate.totalCNY);

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          예상 비용
          {costEstimate.persons && ` (${costEstimate.persons}인 기준)`}
        </span>
        <span className="font-semibold text-gray-900">
          {formatDualCurrency(costEstimate.totalCNY, exchangeRate)}
        </span>
      </div>
      {showAliPayWarning && (
        <p className="mt-2 text-xs text-orange-600">
          ⚠️ 200위안 초과 시 AliPay 3% 수수료 발생
        </p>
      )}
    </div>
  );
}
