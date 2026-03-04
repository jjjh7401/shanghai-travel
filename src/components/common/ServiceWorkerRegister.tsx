"use client";

import { useEffect } from "react";

/**
 * 서비스워커 등록 컴포넌트 (PWA 오프라인 지원)
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // 서비스워커 등록 실패는 무시 (개발 환경 등)
        });
    }
  }, []);

  return null;
}
