import { useState, useEffect, useRef } from "react";
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
}

interface UseGeolocationResult extends GeolocationState {
  retry: () => void;
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

// 緯度経度から最も近い都道府県を判定（同期・即座に結果を返す）
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

// 逆ジオコーディングAPIを並列実行（タイムアウト付き）
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

    // BigDataCloudの結果
    if (bigDataResult.status === "fulfilled") {
      const data = bigDataResult.value;
      if (data?.countryCode === "JP") {
        const city = data.city || data.localityInfo?.informative?.[0]?.name || null;
        const ward = data.localityInfo?.administrative?.find((a: any) => a.order === 5)?.name || null;
        return { city, ward };
      }
    }

    // Nominatimの結果
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

    // getCurrentPositionを使用（watchPositionより確実）
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("Position obtained:", position.coords);
        const { latitude, longitude, accuracy } = position.coords;

        // ステップ1: 即座に距離ベースで都道府県を特定（同期・高速）
        const prefectureName = getNearestPrefecture(latitude, longitude);
        console.log("Nearest prefecture:", prefectureName);

        if (prefectureName) {
          const areaCode = getAreaCodeFromPrefectureName(prefectureName);
          
          if (areaCode) {
            // まず距離ベースの結果で状態を更新（loadingをfalseに）
            setState({
              latitude,
              longitude,
              accuracy: accuracy || null,
              prefectureName,
              cityName: null,
              wardName: null,
              areaCode,
              loading: false,
              error: null,
            });

            // ステップ2: バックグラウンドでAPIから詳細情報を取得
            try {
              const { city, ward } = await reverseGeocodeAsync(latitude, longitude);
              if (city || ward) {
                setState((prev) => ({
                  ...prev,
                  cityName: city,
                  wardName: ward,
                }));
              }
            } catch (error) {
              console.warn("Background geocoding failed:", error);
            }
          } else {
            setState({
              latitude,
              longitude,
              accuracy: accuracy || null,
              prefectureName,
              cityName: null,
              wardName: null,
              areaCode: null,
              loading: false,
              error: `${prefectureName}の予報区コードが見つかりませんでした`,
            });
          }
        } else {
          setState({
            latitude,
            longitude,
            accuracy: accuracy || null,
            prefectureName: null,
            cityName: null,
            wardName: null,
            areaCode: null,
            loading: false,
            error: "位置情報から地域を特定できませんでした",
          });
        }
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
        enableHighAccuracy: false, // falseの方が高速で確実
        timeout: 10000,
        maximumAge: 300000, // 5分間はキャッシュを使用
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
