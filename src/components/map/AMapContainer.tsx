"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Venue } from "@/types/venue";
import { AMAP_KEY, CATEGORY_ICONS, MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from "@/data/constants";

interface AMapContainerProps {
  venues: Venue[];
  selectedVenueId?: string;
  onVenueSelect?: (venue: Venue) => void;
  showRoute?: boolean;
  showUserLocation?: boolean;
  userLocation?: { lat: number; lng: number } | null;
}

// @MX:ANCHOR: AMap 인스턴스 관리의 핵심 컴포넌트 - 중복 스크립트 로드 방지
// @MX:REASON: SSR 미지원, dynamic import(ssr:false)로만 사용. window.AMap 전역 의존.
export function AMapContainer({
  venues,
  selectedVenueId,
  onVenueSelect,
  showRoute = true,
  showUserLocation = true,
  userLocation,
}: AMapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walkingRoute, setWalkingRoute] = useState<{
    from: Venue;
    to: Venue;
    duration: number;
    distance: number;
  } | null>(null);

  // 경로 표시 함수
  // @MX:NOTE: 일차별 방문 순서대로 폴리라인 그리기 (좌표 배열 → AMap.Polyline)
  const drawRoute = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (AMapGlobal: any, map: any) => {
      if (!showRoute || venues.length < 2) return;

      const path = venues.map((v) => [v.coordinates.lng, v.coordinates.lat]);

      const polyline = new AMapGlobal.Polyline({
        path,
        strokeColor: "#3B82F6",
        strokeWeight: 3,
        strokeOpacity: 0.7,
        strokeStyle: "dashed",
        lineJoin: "round",
      });

      map.add(polyline);
    },
    [venues, showRoute]
  );

  // 도보 경로 안내 (Amap Walking API)
  // @MX:NOTE: Walking API는 비동기로 Amap 서버 호출. CORS 이슈 없음 (JS SDK 방식)
  const requestWalkingRoute = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (AMapGlobal: any, map: any, from: Venue, to: Venue) => {
      const walking = new AMapGlobal.Walking({ map });

      walking.search(
        [from.coordinates.lng, from.coordinates.lat],
        [to.coordinates.lng, to.coordinates.lat],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (status: string, result: any) => {
          if (status === "complete" && result.routes.length > 0) {
            const route = result.routes[0];
            setWalkingRoute({
              from,
              to,
              duration: Math.round(route.time / 60), // 분
              distance: route.distance, // 미터
            });
          }
        }
      );
    },
    []
  );

  const initMap = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (AMapGlobal: any) => {
      if (!mapRef.current) return;

      const map = new AMapGlobal.Map(mapRef.current, {
        center: [MAP_DEFAULT_CENTER.lng, MAP_DEFAULT_CENTER.lat],
        zoom: MAP_DEFAULT_ZOOM,
        mapStyle: "amap://styles/normal",
      });

      mapInstanceRef.current = map;

      // 장소 마커 추가
      venues.forEach((venue) => {
        const isSelected = venue.id === selectedVenueId;
        const markerContent = `
          <div style="
            background: ${isSelected ? "#EF4444" : "#3B82F6"};
            color: white;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
          ">${CATEGORY_ICONS[venue.category]}</div>`;

        const marker = new AMapGlobal.Marker({
          position: [venue.coordinates.lng, venue.coordinates.lat],
          content: markerContent,
          offset: new AMapGlobal.Pixel(-18, -18),
          title: venue.name.ko,
        });

        marker.on("click", () => {
          onVenueSelect?.(venue);
        });

        map.add(marker);
      });

      // 경로 폴리라인 그리기
      drawRoute(AMapGlobal, map);

      // 사용자 위치 마커
      if (showUserLocation && userLocation) {
        const userMarkerContent = `
          <div style="
            background: #10B981;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            border: 3px solid white;
            box-shadow: 0 0 0 4px rgba(16,185,129,0.3);
          "></div>`;

        const userMarker = new AMapGlobal.Marker({
          position: [userLocation.lng, userLocation.lat],
          content: userMarkerContent,
          offset: new AMapGlobal.Pixel(-8, -8),
          title: "내 위치",
          zIndex: 200,
        });

        map.add(userMarker);
      }

      setIsLoading(false);

      // 선택된 장소가 있으면 해당 장소로 지도 이동
      if (selectedVenueId) {
        const selected = venues.find((v) => v.id === selectedVenueId);
        if (selected) {
          map.setCenter([selected.coordinates.lng, selected.coordinates.lat]);
          map.setZoom(16);
        }
      }

      // 두 번째 장소부터는 Walking route 미리 표시 (선택된 경우)
      if (selectedVenueId && venues.length >= 2) {
        const selectedIdx = venues.findIndex((v) => v.id === selectedVenueId);
        if (selectedIdx >= 0 && selectedIdx < venues.length - 1) {
          requestWalkingRoute(
            AMapGlobal,
            map,
            venues[selectedIdx],
            venues[selectedIdx + 1]
          );
        }
      }
    },
    [venues, selectedVenueId, onVenueSelect, drawRoute, showUserLocation, userLocation, requestWalkingRoute]
  );

  useEffect(() => {
    if (!AMAP_KEY) {
      setError("Amap API 키가 없습니다. 환경변수 NEXT_PUBLIC_AMAP_KEY를 설정하세요.");
      setIsLoading(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    if (win.AMap) {
      initMap(win.AMap);
      return;
    }

    // 보안 코드 설정 (Amap v2.0 요구사항)
    const securityCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE;
    if (securityCode) {
      win._AMapSecurityConfig = { securityJsCode: securityCode };
    }

    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Walking`;
    script.async = true;
    script.onload = () => initMap(win.AMap);
    script.onerror = () => {
      setError("지도를 불러오지 못했습니다. 네트워크를 확인해 주세요.");
      setIsLoading(false);
    };
    document.head.appendChild(script);
  }, [initMap]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
        <span className="text-5xl mb-3">🗺️</span>
        <p className="text-sm font-medium text-gray-700 mb-1">지도를 표시할 수 없습니다</p>
        <p className="text-xs text-gray-400">{error}</p>
        <div className="mt-4 space-y-1 text-left">
          <p className="text-xs text-gray-500 font-medium">장소 목록으로 확인하세요:</p>
          {venues.slice(0, 3).map((v) => (
            <button
              key={v.id}
              onClick={() => onVenueSelect?.(v)}
              className="block text-xs text-blue-600 hover:underline"
            >
              {v.name.ko} ({v.name.zh})
            </button>
          ))}
          {venues.length > 3 && (
            <p className="text-xs text-gray-400">+{venues.length - 3}개 더...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-72 rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-sm text-gray-500">지도 로드 중...</span>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />

      {/* 도보 경로 정보 오버레이 */}
      {walkingRoute && (
        <div className="absolute bottom-3 left-3 right-3 bg-white rounded-lg shadow-lg p-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">🚶</span>
              <div>
                <p className="text-xs font-medium text-gray-800">
                  {walkingRoute.from.name.ko} → {walkingRoute.to.name.ko}
                </p>
                <p className="text-xs text-gray-500">
                  도보 약 {walkingRoute.duration}분 ({walkingRoute.distance >= 1000
                    ? `${(walkingRoute.distance / 1000).toFixed(1)}km`
                    : `${walkingRoute.distance}m`})
                </p>
              </div>
            </div>
            <button
              onClick={() => setWalkingRoute(null)}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
