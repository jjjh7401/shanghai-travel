"use client";

import type { MenuItem } from "@/types/venue";
import { formatDualCurrency } from "@/lib/currency";

interface MenuListProps {
  items: MenuItem[];
  exchangeRate?: number;
}

/**
 * 메뉴 목록 컴포넌트
 */
export function MenuList({ items, exchangeRate = 200 }: MenuListProps) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-center justify-between p-3 rounded-lg ${
            item.recommended ? "bg-orange-50 border border-orange-200" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {item.recommended && (
              <span className="text-orange-500 text-sm" aria-label="추천">
                ⭐
              </span>
            )}
            <div>
              <span className="font-medium text-gray-900">{item.name.ko}</span>
              {item.name.zh && (
                <span className="ml-1 text-sm text-gray-400">
                  ({item.name.zh})
                </span>
              )}
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {formatDualCurrency(item.priceCNY, exchangeRate)}
          </span>
        </div>
      ))}
    </div>
  );
}
