"use client";

import { useEffect, useRef } from "react";
import type { Venue } from "@/types/venue";
import { CATEGORY_ICONS, MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from "@/data/constants";

interface LeafletMapContainerProps {
  venues: Venue[];
  selectedVenueId?: string;
  onVenueSelect?: (venue: Venue) => void;
  showRoute?: boolean;
  showUserLocation?: boolean;
  userLocation?: { lat: number; lng: number } | null;
}

// GCJ-02 → WGS84 변환 (중국 좌표 → OpenStreetMap 좌표)
// 상하이 기준 약 500m 오차 보정
function gcj02ToWgs84(lng: number, lat: number): { lng: number; lat: number } {
  const a = 6378245.0;
  const ee = 0.00669342162296594323;

  function transformLat(x: number, y: number): number {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  function transformLng(x: number, y: number): number {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
    return ret;
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);

  return { lat: lat - dLat, lng: lng - dLng };
}

// @MX:ANCHOR: Leaflet 지도 컴포넌트 - SSR 미지원, dynamic import(ssr:false)로만 사용
// @MX:REASON: Leaflet은 window/document 의존, 서버에서 실행 불가
export function LeafletMapContainer({
  venues,
  selectedVenueId,
  onVenueSelect,
  showRoute = true,
  showUserLocation = true,
  userLocation,
}: LeafletMapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);

  // 지도 초기화 (최초 1회)
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Leaflet CSS 동적 로드
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const center = gcj02ToWgs84(MAP_DEFAULT_CENTER.lng, MAP_DEFAULT_CENTER.lat);

      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: MAP_DEFAULT_ZOOM,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 마커 및 경로 갱신 (venues / selectedVenueId 변경 시)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // 기존 마커 제거
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // 기존 경로 제거
      if (routeRef.current) {
        routeRef.current.remove();
        routeRef.current = null;
      }

      // 장소 마커 추가
      venues.forEach((venue) => {
        const isSelected = venue.id === selectedVenueId;
        const wgs = gcj02ToWgs84(venue.coordinates.lng, venue.coordinates.lat);
        const icon = CATEGORY_ICONS[venue.category];

        const divIcon = L.divIcon({
          html: `<div style="
            background:${isSelected ? "#EF4444" : "#3B82F6"};
            color:white;border-radius:50%;
            width:36px;height:36px;
            display:flex;align-items:center;justify-content:center;
            font-size:16px;border:2px solid white;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;
          ">${icon}</div>`,
          className: "",
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([wgs.lat, wgs.lng], { icon: divIcon, title: venue.name.ko });
        marker.bindTooltip(venue.name.ko, { permanent: false, direction: "top" });
        marker.on("click", () => onVenueSelect?.(venue));
        marker.addTo(map);
        markersRef.current.push(marker);
      });

      // 경로 폴리라인 추가
      if (showRoute && venues.length >= 2) {
        const points = venues.map((v) => {
          const wgs = gcj02ToWgs84(v.coordinates.lng, v.coordinates.lat);
          return [wgs.lat, wgs.lng] as [number, number];
        });
        routeRef.current = L.polyline(points, {
          color: "#3B82F6",
          weight: 3,
          opacity: 0.7,
          dashArray: "8, 6",
        }).addTo(map);
      }

      // 선택된 장소로 이동
      if (selectedVenueId) {
        const selected = venues.find((v) => v.id === selectedVenueId);
        if (selected) {
          const wgs = gcj02ToWgs84(selected.coordinates.lng, selected.coordinates.lat);
          map.setView([wgs.lat, wgs.lng], 16, { animate: true });
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venues, selectedVenueId]);

  // 사용자 위치 마커 갱신
  useEffect(() => {
    if (!mapInstanceRef.current || !showUserLocation) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }

      if (userLocation) {
        const userWgs = gcj02ToWgs84(userLocation.lng, userLocation.lat);
        const userIcon = L.divIcon({
          html: `<div style="
            background:#10B981;border-radius:50%;
            width:16px;height:16px;
            border:3px solid white;
            box-shadow:0 0 0 4px rgba(16,185,129,0.3);
          "></div>`,
          className: "",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        userMarkerRef.current = L.marker([userWgs.lat, userWgs.lng], { icon: userIcon, title: "내 위치" }).addTo(map);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, showUserLocation]);

  return (
    <div className="relative w-full h-full min-h-72 rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
