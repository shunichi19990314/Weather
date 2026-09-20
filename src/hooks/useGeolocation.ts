import { useState, useEffect } from "react";
import { prefectureNameToCode } from "../data/prefectures";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  prefectureName: string | null;
  cityName: string | null;
  areaCode: string | null;
  loading: boolean;
  error: string | null;
}

interface UseGeolocationResult extends GeolocationState {
  retry: () => void;
}

// 都道府県庁所在地の座標データ（緯度, 経度）
// 出典: 国土地理院
const PREFECTURE_CAPITALS: Record<string, [number, number]> = {
  "北海道": [43.0618, 141.3545], // 札幌市
  "青森県": [40.8244, 140.7400], // 青森市
  "岩手県": [39.7036, 141.1527], // 盛岡市
  "宮城県": [38.2688, 140.8721], // 仙台市
  "秋田県": [39.7186, 140.1024], // 秋田市
  "山形県": [38.2405, 140.3633], // 山形市
  "福島県": [37.7503, 140.4676], // 福島市
  "茨城県": [36.3414, 140.4468], // 水戸市
  "栃木県": [36.5658, 139.8836], // 宇都宮市
  "群馬県": [36.3911, 139.0608], // 前橋市
  "埼玉県": [35.8569, 139.6489], // さいたま市
  "千葉県": [35.6074, 140.1236], // 千葉市
  "東京都": [35.6895, 139.6917], // 新宿区
  "神奈川県": [35.4478, 139.6425], // 横浜市
  "新潟県": [37.9026, 139.0232], // 新潟市
  "富山県": [36.6953, 137.2114], // 富山市
  "石川県": [36.5946, 136.6256], // 金沢市
  "福井県": [36.0652, 136.2216], // 福井市
  "山梨県": [35.6635, 138.5684], // 甲府市
  "長野県": [36.6514, 138.1809], // 長野市
  "岐阜県": [35.3912, 136.7223], // 岐阜市
  "静岡県": [34.9769, 138.3831], // 静岡市
  "愛知県": [35.1802, 136.9066], // 名古屋市
  "三重県": [34.7303, 136.5086], // 津市
  "滋賀県": [35.0045, 135.8686], // 大津市
  "京都府": [35.0214, 135.7556], // 京都市
  "大阪府": [34.6863, 135.5200], // 大阪市
  "兵庫県": [34.6913, 135.1830], // 神戸市
  "奈良県": [34.6853, 135.8327], // 奈良市
  "和歌山県": [34.2261, 135.1675], // 和歌山市
  "鳥取県": [35.5039, 134.2383], // 鳥取市
  "島根県": [35.4723, 133.0505], // 松江市
  "岡山県": [34.6618, 133.9344], // 岡山市
  "広島県": [34.3966, 132.4596], // 広島市
  "山口県": [34.1861, 131.4714], // 山口市
  "徳島県": [34.0658, 134.5593], // 徳島市
  "香川県": [34.3401, 134.0434], // 高松市
  "愛媛県": [33.8416, 132.7657], // 松山市
  "高知県": [33.5597, 133.5311], // 高知市
  "福岡県": [33.6066, 130.4183], // 福岡市
  "佐賀県": [33.2494, 130.2998], // 佐賀市
  "長崎県": [32.7448, 129.8737], // 長崎市
  "熊本県": [32.7898, 130.7417], // 熊本市
  "大分県": [33.2382, 131.6126], // 大分市
  "宮崎県": [31.9105, 131.4239], // 宮崎市
  "鹿児島県": [31.5602, 130.5581], // 鹿児島市
  "沖縄県": [26.3344, 127.8056], // 那覇市
};

// ハバーサイン距離を計算（2点間の距離をkmで返す）
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球の半径（km）
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

// Nominatim APIで逆ジオコーディング（フォールバック）
async function reverseGeocodeNominatim(lat: number, lon: number): Promise<{ prefecture: string | null; city: string | null }> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ja&zoom=10&addressdetails=1&layer=address`;
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });
    
    if (!response.ok) {
      return { prefecture: null, city: null };
    }
    
    const data = await response.json();
    
    // 日本国外の場合
    if (data.address?.country_code && data.address.country_code !== "jp") {
      return { prefecture: null, city: null };
    }
    
    const prefecture = data.address?.state || null;
    const city = data.address?.city || data.address?.town || data.address?.county || null;
    
    return { prefecture, city };
  } catch (error) {
    console.warn("Nominatim API error:", error);
    return { prefecture: null, city: null };
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
    cityName: null,
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

        // 方法1: 都道府県庁所在地からの距離で判定（高速・確実）
        let prefectureName = getNearestPrefecture(latitude, longitude);
        let cityName: string | null = null;

        // 方法2: Nominatim APIで市区町村を取得（フォールバック）
        if (prefectureName) {
          const nominatimResult = await reverseGeocodeNominatim(latitude, longitude);
          if (nominatimResult.prefecture) {
            // Nominatimの結果を優先（より正確）
            prefectureName = nominatimResult.prefecture;
            cityName = nominatimResult.city;
          } else {
            // Nominatimが失敗した場合は距離ベースの結果を使用
            cityName = null;
          }
        }

        if (prefectureName) {
          const areaCode = getAreaCodeFromPrefectureName(prefectureName);
          
          if (areaCode) {
            setState((prev) => ({
              ...prev,
              prefectureName,
              cityName,
              areaCode,
              loading: false,
              error: null,
            }));
          } else {
            setState((prev) => ({
              ...prev,
              prefectureName,
              cityName,
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
        enableHighAccuracy: true, // 高精度モードを有効化
        timeout: 15000,
        maximumAge: 60000, // 1分間はキャッシュを使用
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
