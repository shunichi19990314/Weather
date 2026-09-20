import { useState, useEffect, useRef, useCallback } from "react";
import { prefectureNameToCode, prefectures } from "../data/prefectures";
import { prefectureCoordinates } from "../data/prefectureCoordinates";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  prefectureName: string | null;
  cityName: string | null;
  wardName: string | null;
  areaCode: string | null;
  loading: boolean;
  error: string | null;
}

interface UseGeolocationResult extends GeolocationState {
  retry: () => void;
}

// ハバーサイン距離を計算（2 点間の距離を km で返す）
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 緯度経度から最も近い予報区を判定（同期・即座に結果を返す）
function getNearestForecastArea(lat: number, lon: number): string | null {
  let nearestCode: string | null = null;
  let minDistance = Infinity;

  for (const [code, coords] of Object.entries(prefectureCoordinates)) {
    const distance = haversineDistance(lat, lon, coords.lat, coords.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCode = code;
    }
  }

  return nearestCode;
}

// 都道府県名から予報区コードを取得（同期）
function getAreaCodeFromPrefectureName(prefectureName: string): string | null {
  if (prefectureNameToCode[prefectureName]) {
    return prefectureNameToCode[prefectureName];
  }
  
  for (const [name, code] of Object.entries(prefectureNameToCode)) {
    if (prefectureName.includes(name) || name.includes(prefectureName)) {
      return code;
    }
  }
  
  return null;
}

// 逆ジオコーディング API を並列実行（タイムアウト付き）
async function reverseGeocodeAsync(lat: number, lon: number): Promise<{
  city: string | null;
  ward: string | null;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    // BigDataCloud API と Nominatim API を並列実行
    const [bigDataResult, nominatimResult] = await Promise.allSettled([
      fetch(`https://api.bigdatacloud.com/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ja`, {
        signal: controller.signal,
      }).then(r => r.json()),
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ja&zoom=12&addressdetails=1`, {
        signal: controller.signal,
        headers: { "Accept": "application/json" },
      }).then(r => r.json()),
    ]);

    clearTimeout(timeoutId);

    // BigDataCloud の結果
    if (bigDataResult.status === "fulfilled") {
      const data = bigDataResult.value;
      if (data?.countryCode === "JP") {
        const city = data.city || data.localityInfo?.informative?.[0]?.name || null;
        const ward = data.localityInfo?.administrative?.find((a: any) => a.order === 5)?.name || null;
        return { city, ward };
      }
    }

    // Nominatim の結果
    if (nominatimResult.status === "fulfilled") {
      const data = nominatimResult.value;
      if (data?.address?.country_code === "jp") {
        const city = data.address.city || data.address.town || data.address.county || null;
        const ward = data.address.suburb || data.address.city_district || data.address.district || null;
        return { city, ward };
      }
    }

    return { city: null, ward: null };
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Reverse geocoding failed:", error);
    return { city: null, ward: null };
  }
}

export function useGeolocation(): UseGeolocationResult {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    prefectureName: null,
    cityName: null,
    wardName: null,
    areaCode: null,
    loading: true,
    error: null,
  });

  const isInitialMount = useRef(true);

  // 緯度経度が変更されたときに、その位置から予報区コードを計算する関数
  const updateLocationFromCoords = useCallback((lat: number, lon: number, accuracy: number | null) => {
    // 最も近い予報区を取得
    const forecastAreaCode = getNearestForecastArea(lat, lon);
    
    if (!forecastAreaCode) {
      setState({
        latitude: lat,
        longitude: lon,
        accuracy: accuracy || null,
        prefectureName: null,
        cityName: null,
        wardName: null,
        areaCode: null,
        loading: false,
        error: "位置情報から地域を特定できませんでした",
      });
      return;
    }

    // 予報区名を取得
    const forecastArea = prefectures.find(p => p.code === forecastAreaCode);
    const prefectureName = forecastArea?.name || null;

    setState({
      latitude: lat,
      longitude: lon,
      accuracy: accuracy || null,
      prefectureName,
      cityName: null,
      wardName: null,
      areaCode: forecastAreaCode,
      loading: false,
      error: null,
    });

    // バックグラウンドで API から詳細情報を取得
    reverseGeocodeAsync(lat, lon).then(({ city, ward }) => {
      if (city || ward) {
        setState((prev) => ({
          ...prev,
          cityName: city,
          wardName: ward,
        }));
      }
    }).catch((error) => {
      console.warn("Background geocoding failed:", error);
    });
  }, []);

  const getLocation = () => {
    console.log("getLocation called");
    
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "お使いのブラウザは位置情報に対応していません",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("Position obtained:", position.coords);
        const { latitude, longitude, accuracy } = position.coords;

        // 緯度経度から予報区を更新
        updateLocationFromCoords(latitude, longitude, accuracy || null);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "位置情報の取得に失敗しました";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "位置情報の利用が許可されていません。ブラウザの設定で位置情報を許可してください。";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "位置情報が利用できません";
            break;
          case error.TIMEOUT:
            errorMessage = "位置情報の取得がタイムアウトしました";
            break;
        }
        
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      getLocation();
    }
  }, []);

  return {
    ...state,
    retry: getLocation,
  };
}
