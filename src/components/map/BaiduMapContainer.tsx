"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Venue } from "@/types/venue";
import { BAIDU_MAP_KEY, CATEGORY_ICONS, MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from "@/data/constants";

interface BaiduMapContainerProps {
  venues: Venue[];
  selectedVenueId?: string;
  onVenueSelect?: (venue: Venue) => void;
  showRoute?: boolean;
  showUserLocation?: boolean;
  userLocation?: { lat: number; lng: number } | null;
}

// GCJ-02 → BD-09 좌표 변환 (Amap 좌표 → 바이두 좌표)
const X_PI = (Math.PI * 3000.0) / 180.0;
function gcj02ToBd09(lng: number, lat: number): { lng: number; lat: number } {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
  return {
    lng: z * Math.cos(theta) + 0.0065,
    lat: z * Math.sin(theta) + 0.006,
  };
}

// @MX:ANCHOR: 바이두 지도 컴포넌트 - SSR 미지원, dynamic import(ssr:false)로만 사용
// @MX:REASON: BMap 전역 객체 의존, window에서 동적 로드
export function BaiduMapContainer({
  venues,
  selectedVenueId,
  onVenueSelect,
  showRoute = true,
  showUserLocation = true,
  userLocation,
}: BaiduMapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walkingInfo, setWalkingInfo] = useState<{
    from: string;
    to: string;
    duration: number;
    distance: number;
  } | null>(null);

  const initMap = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const BMap = (window as any).BMap;
    if (!mapRef.current || !BMap) return;

    // 중심 좌표 변환 (GCJ-02 → BD-09)
    const center = gcj02ToBd09(MAP_DEFAULT_CENTER.lng, MAP_DEFAULT_CENTER.lat);
    const map = new BMap.Map(mapRef.current);
    map.centerAndZoom(new BMap.Point(center.lng, center.lat), MAP_DEFAULT_ZOOM);
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.NavigationControl());
    mapInstanceRef.current = map;

    // 장소 마커 추가
    venues.forEach((venue) => {
      const isSelected = venue.id === selectedVenueId;
      const bd = gcj02ToBd09(venue.coordinates.lng, venue.coordinates.lat);
      const point = new BMap.Point(bd.lng, bd.lat);

      const icon = CATEGORY_ICONS[venue.category];
      const markerHtml = `<div style="
        background:${isSelected ? "#EF4444" : "#3B82F6"};
        color:white;border-radius:50%;
        width:36px;height:36px;
        display:flex;align-items:center;justify-content:center;
        font-size:16px;border:2px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;
      ">${icon}</div>`;

      const myIcon = new BMap.Icon(
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
            <circle cx="20" cy="20" r="18" fill="${isSelected ? "#EF4444" : "#3B82F6"}" stroke="white" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" font-size="16">${icon}</text>
          </svg>
        `),
        new BMap.Size(40, 40),
        { anchor: new BMap.Size(20, 20) }
      );

      const marker = new BMap.Marker(point, { icon: myIcon, title: venue.name.ko });
      marker.addEventListener("click", () => {
        onVenueSelect?.(venue);
      });

      const label = new BMap.Label(venue.name.ko, {
        offset: new BMap.Size(20, -10),
      });
      label.setStyle({
        fontSize: "11px",
        color: "#374151",
        border: "1px solid #E5E7EB",
        borderRadius: "4px",
        padding: "1px 4px",
        background: "white",
        whiteSpace: "nowrap",
      });
      marker.setLabel(label);
      map.addOverlay(marker);
    });

    // 경로 폴리라인
    if (showRoute && venues.length >= 2) {
      const points = venues.map((v) => {
        const bd = gcj02ToBd09(v.coordinates.lng, v.coordinates.lat);
        return new BMap.Point(bd.lng, bd.lat);
      });
      const polyline = new BMap.Polyline(points, {
        strokeColor: "#3B82F6",
        strokeWeight: 3,
        strokeOpacity: 0.7,
        strokeStyle: "dashed",
      });
      map.addOverlay(polyline);
    }

    // 사용자 위치 마커
    if (showUserLocation && userLocation) {
      const userBd = gcj02ToBd09(userLocation.lng, userLocation.lat);
      const userIcon = new BMap.Icon(
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <circle cx="12" cy="12" r="8" fill="#10B981" stroke="white" stroke-width="3"/>
            <circle cx="12" cy="12" r="12" fill="rgba(16,185,129,0.2)" stroke="none"/>
          </svg>
        `),
        new BMap.Size(24, 24),
        { anchor: new BMap.Size(12, 12) }
      );
      const userMarker = new BMap.Marker(
        new BMap.Point(userBd.lng, userBd.lat),
        { icon: userIcon, title: "내 위치" }
      );
      map.addOverlay(userMarker);
    }

    // 선택된 장소로 이동
    if (selectedVenueId) {
      const selected = venues.find((v) => v.id === selectedVenueId);
      if (selected) {
        const bd = gcj02ToBd09(selected.coordinates.lng, selected.coordinates.lat);
        map.panTo(new BMap.Point(bd.lng, bd.lat));
        map.setZoom(16);

        // 도보 경로 계산 (다음 장소까지)
        const idx = venues.findIndex((v) => v.id === selectedVenueId);
        if (idx >= 0 && idx < venues.length - 1) {
          const next = venues[idx + 1];
          const fromBd = gcj02ToBd09(selected.coordinates.lng, selected.coordinates.lat);
          const toBd = gcj02ToBd09(next.coordinates.lng, next.coordinates.lat);

          const walking = new BMap.WalkingRoute(map, {
            renderOptions: { map, autoViewport: false },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSearchComplete: (results: any) => {
              if (walking.getStatus() === 0 && results.getNumPlans() > 0) {
                const plan = results.getPlan(0);
                setWalkingInfo({
                  from: selected.name.ko,
                  to: next.name.ko,
                  duration: Math.round(plan.getDuration() / 60),
                  distance: plan.getDistance(false) as number,
                });
              }
            },
          });
          walking.search(
            new BMap.Point(fromBd.lng, fromBd.lat),
            new BMap.Point(toBd.lng, toBd.lat)
          );
        }
      }
    }

    setIsLoading(false);
  }, [venues, selectedVenueId, onVenueSelect, showRoute, showUserLocation, userLocation]);

  useEffect(() => {
    if (!BAIDU_MAP_KEY) {
      setError("Baidu Maps API 키가 없습니다. NEXT_PUBLIC_BAIDU_MAP_KEY를 설정하세요.");
      setIsLoading(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (win.BMap) {
      initMap();
      return;
    }

    // 콜백 함수 등록
    win.baiduMapInit = () => {
      initMap();
      delete win.baiduMapInit;
    };

    const script = document.createElement("script");
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${BAIDU_MAP_KEY}&callback=baiduMapInit`;
    script.async = true;
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

      {walkingInfo && (
        <div className="absolute bottom-3 left-3 right-3 bg-white rounded-lg shadow-lg p-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">🚶</span>
              <div>
                <p className="text-xs font-medium text-gray-800">
                  {walkingInfo.from} → {walkingInfo.to}
                </p>
                <p className="text-xs text-gray-500">
                  도보 약 {walkingInfo.duration}분 (
                  {walkingInfo.distance >= 1000
                    ? `${(walkingInfo.distance / 1000).toFixed(1)}km`
                    : `${Math.round(walkingInfo.distance)}m`}
                  )
                </p>
              </div>
            </div>
            <button
              onClick={() => setWalkingInfo(null)}
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
