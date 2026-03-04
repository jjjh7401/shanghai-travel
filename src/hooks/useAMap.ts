"use client";

import { useState, useEffect } from "react";
import { AMAP_KEY } from "@/data/constants";

interface AMapState {
  loaded: boolean;
  error: string | null;
}

/**
 * AMap(高德地图) SDK를 로드하는 커스텀 훅
 */
export function useAMap(): AMapState {
  const [state, setState] = useState<AMapState>({
    loaded: false,
    error: null,
  });

  useEffect(() => {
    if (!AMAP_KEY) {
      setState({
        loaded: false,
        error: "AMap API 키가 설정되지 않았습니다. (NEXT_PUBLIC_AMAP_KEY)",
      });
      return;
    }

    // 이미 로드된 경우
    if (window.AMap) {
      setState({ loaded: true, error: null });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
    script.async = true;

    script.onload = () => {
      setState({ loaded: true, error: null });
    };

    script.onerror = () => {
      setState({ loaded: false, error: "AMap SDK 로드 실패" });
    };

    document.head.appendChild(script);

    return () => {
      // 스크립트 정리 (실제로는 AMap 언로드 API 필요)
    };
  }, []);

  return state;
}

// AMap global 타입 선언
declare global {
  interface Window {
    AMap: unknown;
  }
}
