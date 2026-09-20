import { useState, useEffect } from "react";
import { prefectureNameToCode } from "../data/prefectures";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  prefectureName: string | null;
  areaCode: string | null;
  loading: boolean;
  error: string | null;
}

interface UseGeolocationResult extends GeolocationState {
  retry: () => void;
}

// 都道府県の概略の緯度経度範囲（バウンディングボックス）
// [name, minLat, maxLat, minLon, maxLon]
const PREFECTURE_BOUNDS: [string, number, number, number, number][] = [
  ["北海道", 41.0, 45.5, 139.0, 146.0],
  ["青森県", 40.0, 41.6, 139.5, 142.0],
  ["岩手県", 38.7, 40.5, 140.5, 142.2],
  ["宮城県", 37.8, 39.2, 140.0, 142.0],
  ["秋田県", 38.8, 40.5, 139.3, 140.5],
  ["山形県", 37.7, 39.2, 139.3, 140.5],
  ["福島県", 36.8, 38.0, 139.0, 141.2],
  ["茨城県", 35.7, 37.0, 139.5, 141.0],
  ["栃木県", 36.0, 37.2, 139.0, 140.5],
  ["群馬県", 35.8, 37.2, 138.3, 140.0],
  ["埼玉県", 35.7, 36.3, 138.8, 140.0],
  ["千葉県", 34.8, 36.2, 139.5, 140.9],
  ["東京都", 35.5, 35.9, 138.9, 139.9],
  ["神奈川県", 35.0, 35.7, 138.8, 139.8],
  ["新潟県", 36.5, 38.5, 137.5, 140.0],
  ["富山県", 36.2, 37.2, 136.5, 138.0],
  ["石川県", 36.0, 37.9, 136.0, 137.5],
  ["福井県", 35.3, 36.5, 135.3, 136.8],
  ["山梨県", 35.1, 36.2, 138.0, 139.2],
  ["長野県", 35.0, 37.2, 137.5, 139.2],
  ["岐阜県", 35.0, 36.8, 136.0, 138.0],
  ["静岡県", 34.5, 35.5, 137.0, 139.2],
  ["愛知県", 34.5, 35.5, 136.5, 138.0],
  ["三重県", 33.5, 35.2, 135.5, 137.5],
  ["滋賀県", 34.7, 35.7, 135.5, 137.0],
  ["京都府", 34.7, 36.0, 134.5, 136.5],
  ["大阪府", 34.2, 35.0, 135.0, 136.0],
  ["兵庫県", 34.0, 35.8, 134.0, 136.0],
  ["奈良県", 33.8, 35.0, 135.5, 136.5],
  ["和歌山県", 33.3, 34.5, 134.8, 136.5],
  ["鳥取県", 34.8, 35.8, 133.0, 135.0],
  ["島根県", 34.0, 36.0, 131.5, 134.5],
  ["岡山県", 34.0, 35.5, 133.0, 135.0],
  ["広島県", 33.8, 35.2, 131.8, 134.0],
  ["山口県", 33.5, 35.0, 130.5, 132.5],
  ["徳島県", 33.5, 34.5, 133.5, 135.5],
  ["香川県", 33.8, 34.8, 133.5, 134.8],
  ["愛媛県", 32.8, 34.5, 132.0, 134.0],
  ["高知県", 32.5, 34.2, 132.5, 134.5],
  ["福岡県", 33.0, 34.2, 129.5, 131.5],
  ["佐賀県", 32.8, 33.8, 129.5, 131.0],
  ["長崎県", 32.0, 34.0, 128.5, 130.5],
  ["熊本県", 31.8, 33.5, 129.8, 132.0],
  ["大分県", 32.5, 34.2, 130.8, 133.0],
  ["宮崎県", 31.0, 33.5, 130.5, 132.5],
  ["鹿児島県", 30.0, 32.5, 129.0, 132.0],
  ["沖縄県", 24.0, 27.0, 122.0, 131.0],
];

// 緯度経度から都道府県名を判定（バウンディングボックスベース）
function getPrefectureFromCoordinates(lat: number, lon: number): string | null {
  // 日本の範囲外の場合
  if (lat < 24 || lat > 46 || lon < 122 || lon > 146) {
    return null;
  }

  // 各都道府県の範囲をチェック
  for (const [name, minLat, maxLat, minLon, maxLon] of PREFECTURE_BOUNDS) {
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return name;
    }
  }

  // 範囲が重複する地域の場合、中心からの距離で判定
  // 東京都と神奈川県の境界付近など
  if (lat >= 35.0 && lat <= 36.0 && lon >= 138.8 && lon <= 140.0) {
    if (lat < 35.5) return "神奈川県";
    if (lon < 139.5) return "山梨県";
    return "東京都";
  }

  return null;
}

// Nominatim APIで逆ジオコーディング（緯度経度 → 都道府県名）
async function reverseGeocodeNominatim(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ja&zoom=5&addressdetails=1&layer=address`;
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });
    
    if (!response.ok) {
      console.warn(`Nominatim API error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // 日本国外の場合
    if (data.address?.country_code && data.address.country_code !== "jp") {
      return null;
    }
    
    // 都道府県名を取得（stateフィールド）
    const state = data.address?.state;
    if (state) {
      return state;
    }
    
    return null;
  } catch (error) {
    console.warn("Nominatim API error:", error);
    return null;
  }
}

// 都道府県名から予報区コードを取得
function getAreaCodeFromPrefectureName(prefectureName: string): string | null {
  // 完全一致で検索
  if (prefectureNameToCode[prefectureName]) {
    return prefectureNameToCode[prefectureName];
  }
  
  // 部分一致で検索（「県」や「府」が含まれていない場合など）
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
    prefectureName: null,
    areaCode: null,
    loading: true,
    error: null,
  });

  const getLocation = () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "お使いのブラウザは位置情報に対応していません",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setState((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        // まず緯度経度ベースで判定（高速・確実）
        let prefectureName = getPrefectureFromCoordinates(latitude, longitude);
        
        // 判定できない場合はNominatim APIを試す
        if (!prefectureName) {
          prefectureName = await reverseGeocodeNominatim(latitude, longitude);
        }
        
        if (prefectureName) {
          const areaCode = getAreaCodeFromPrefectureName(prefectureName);
          
          if (areaCode) {
            setState((prev) => ({
              ...prev,
              prefectureName,
              areaCode,
              loading: false,
              error: null,
            }));
          } else {
            setState((prev) => ({
              ...prev,
              prefectureName,
              loading: false,
              error: `${prefectureName}の予報区コードが見つかりませんでした`,
            }));
          }
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "位置情報から地域を特定できませんでした",
          }));
        }
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
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5分間はキャッシュを使用
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return {
    ...state,
    retry: getLocation,
  };
}
