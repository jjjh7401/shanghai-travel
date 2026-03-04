"use client";

import type { WarningSeverity } from "@/types/venue";

interface WarningBadgeProps {
  severity: WarningSeverity;
  content: string;
  className?: string;
}

/**
 * 경고 배지 컴포넌트 - danger(빨강), caution(노랑/주황) 심각도 지원
 */
export function WarningBadge({
  severity,
  content,
  className = "",
}: WarningBadgeProps) {
  const severityClasses = {
    danger: "bg-red-100 border-red-400 text-red-800 danger",
    caution: "bg-yellow-100 border-amber-400 text-amber-800 caution",
  };

  const icons = {
    danger: "⚠️",
    caution: "⚡",
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${severityClasses[severity]} ${className}`}
    >
      <span className="flex-shrink-0 text-base" aria-hidden="true">
        {icons[severity]}
      </span>
      <span className="text-sm font-medium">{content}</span>
    </div>
  );
}
