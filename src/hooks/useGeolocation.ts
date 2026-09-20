import { useState, useEffect, useCallback } from "react";
import { prefectureNameToCode } from "../data/prefectures";

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
  watchId: number | null;
}

interface UseGeolocationResult extends GeolocationState {
  retry: () => void;
  stopWatching: () => void;
}

// 都道府県庁所在地の座標データ（緯度, 経度）
const PREFECTURE_CAPITALS: Record<string, [number, number]> = {
  "北海道": [43.0618, 141.3545],
  "青森県": [40.8244, 140.7400],
  "岩手県": [39.7036, 141.1527],
  "宮城県": [38.2688, 140.8721],
  "秋田県": [39.7036, 140.1024],
  "山形県": [38.2405, 140.3633],
  "福島県": [37.7503, 140.4676],
  "茨城県": [36.3414, 140.4468],
  "栃木県": [36.5658, 139.8836],
  "群馬県": [36.3911, 139.0608],
  "埼玉県": [35.8569, 139.6489],
  "千葉県": [35.6074, 140.1236],
  "東京都": [35.6895, 139.6917],
  "神奈川県": [35.4478, 139.6425],
  "新潟県": [37.9026, 139.0232],
  "富山県": [36.6953, 137.2114],
  "石川県": [36.5946, 136.6256],
  "福井県": [36.0652, 136.2216],
  "山梨県": [35.6635, 138.5684],
  "長野県": [36.6514, 138.1809],
  "岐阜県": [35.3912, 136.7223],
  "静岡県": [34.9769, 138.3831],
  "愛知県": [35.1802, 136.9066],
  "三重県": [34.7303, 136.5086],
  "滋賀県": [35.0045, 135.8686],
  "京都府": [35.0214, 135.7556],
  "大阪府": [34.6863, 135.5200],
  "兵庫県": [34.6913, 135.1830],
  "奈良県": [34.6853, 135.8327],
  "和歌山県": [34.2261, 135.1675],
  "鳥取県": [35.5039, 134.2383],
  "島根県": [35.4723, 133.0505],
  "岡山県": [34.6618, 133.9344],
  "広島県": [34.3966, 132.4596],
  "山口県": [34.1861, 131.4714],
  "徳島県": [34.0658, 134.5593],
  "香川県": [34.3401, 134.0434],
  "愛媛県": [33.8416, 132.7657],
  "高知県": [33.5597, 133.5311],
  "福岡県": [33.6066, 130.4183],
  "佐賀県": [33.2494, 130.2998],
  "長崎県": [32.7448, 129.8737],
  "熊本県": [32.7898, 130.7417],
  "大分県": [33.2382, 131.6126],
  "宮崎県": [31.9105, 131.4239],
  "鹿児島県": [31.5602, 130.5581],
  "沖縄県": [26.3344, 127.8056],
};

// ハバーサイン距離を計算（2点間の距離をkmで返す）
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

// 緯度経度から最も近い都道府県を判定
function getNearestPrefecture(lat: number, lon: number): string | null {
  let nearestPrefecture: string | null = null;
  let minDistance = Infinity;

  for (const [prefecture, [capitalLat, capitalLon]] of Object.entries(PREFECTURE_CAPITALS)) {
    const distance = haversineDistance(lat, lon, capitalLat, capitalLon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestPrefecture = prefecture;
    }
  }

  return nearestPrefecture;
}

// 複数の逆ジオコーディングAPIを試す
async function reverseGeocodeMultiSource(lat: number, lon: number): Promise<{
  prefecture: string | null;
  city: string | null;
  ward: string | null;
}> {
  // 方法1: BigDataCloud API（無料・制限なし）
  try {
    const response1 = await fetch(
      `https://api.bigdatacloud.com/client/ip-geolocation?latitude=${lat}&longitude=${lon}&key=free`
    );
    if (response1.ok) {
      const data1 = await response1.json();
      if (data1.principalSubdivision && data1.isoCountry === "JP") {
        return {
          prefecture: data1.principalSubdivision,
          city: data1.city || null,
          ward: data1.localityInfo?.administrative?.[2]?.name || null,
        };
      }
    }
  } catch (e) {
    console.warn("BigDataCloud API failed:", e);
  }

  // 方法2: Nominatim API（OpenStreetMap）
  try {
    const response2 = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ja&zoom=12&addressdetails=1&layer=address`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );
    if (response2.ok) {
      const data2 = await response2.json();
      if (data2.address?.country_code === "jp") {
        return {
          prefecture: data2.address.state || null,
          city: data2.address.city || data2.address.town || data2.address.county || null,
          ward: data2.address.suburb || data2.address.city_district || data2.address.district || null,
        };
      }
    }
  } catch (e) {
    console.warn("Nominatim API failed:", e);
  }

  // 方法3: 距離ベースのフォールバック
  const prefecture = getNearestPrefecture(lat, lon);
  return {
    prefecture,
    city: null,
    ward: null,
  };
}

// 都道府県名から予報区コードを取得
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
    watchId: null,
  });

  const processLocation = useCallback(async (lat: number, lon: number, accuracy: number) => {
    setState((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      accuracy,
    }));

    // 複数の逆ジオコーディングソースを試す
    const result = await reverseGeocodeMultiSource(lat, lon);

    if (result.prefecture) {
      const areaCode = getAreaCodeFromPrefectureName(result.prefecture);
      
      if (areaCode) {
        setState((prev) => ({
          ...prev,
          prefectureName: result.prefecture,
          cityName: result.city,
          wardName: result.ward,
          areaCode,
          loading: false,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          prefectureName: result.prefecture,
          cityName: result.city,
          wardName: result.ward,
          loading: false,
          error: `${result.prefecture}の予報区コードが見つかりませんでした`,
        }));
      }
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "位置情報から地域を特定できませんでした",
      }));
    }
  }, []);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "お使いのブラウザは位置情報に対応していません",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    // watchPositionで継続的に位置情報を取得
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        processLocation(latitude, longitude, accuracy || 0);
      },
      (error) => {
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
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      }
    );

    setState((prev) => ({ ...prev, watchId }));
  }, [processLocation]);

  const stopWatching = useCallback(() => {
    if (state.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(state.watchId);
      setState((prev) => ({ ...prev, watchId: null }));
    }
  }, [state.watchId]);

  const retry = useCallback(() => {
    stopWatching();
    startWatching();
  }, [stopWatching, startWatching]);

  useEffect(() => {
    startWatching();

    // クリーンアップ
    return () => {
      stopWatching();
    };
  }, [startWatching, stopWatching]);

  return {
    ...state,
    retry,
    stopWatching,
  };
}
