"use client";

import { useState, useEffect } from "react";
import type { Venue } from "@/types/venue";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

/**
 * 사용자 위치를 가져오는 커스텀 훅
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "이 브라우저는 위치 정보를 지원하지 않습니다.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}

/**
 * 두 좌표 간 거리를 계산한다 (미터 단위, Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // 지구 반경 (미터)
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 근접한 장소를 찾는다 (500m 이내)
 */
export function getNearbyVenues(
  userLat: number,
  userLng: number,
  venues: Venue[],
  thresholdMeters = 500
): Venue[] {
  return venues.filter((venue) => {
    const distance = calculateDistance(
      userLat,
      userLng,
      venue.coordinates.lat,
      venue.coordinates.lng
    );
    return distance <= thresholdMeters;
  });
}
