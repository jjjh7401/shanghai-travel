"use client";

import { useOffline } from "@/hooks/useOffline";

interface OfflineIndicatorProps {
  className?: string;
}

/**
 * 오프라인 상태 표시 컴포넌트
 */
export function OfflineIndicator({ className = "" }: OfflineIndicatorProps) {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-gray-800 text-white text-sm px-4 py-2 ${className}`}
    >
      <span>📵</span>
      <span>오프라인 상태 - 저장된 데이터를 표시합니다</span>
    </div>
  );
}
