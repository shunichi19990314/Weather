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

// Nominatim APIで逆ジオコーディング（緯度経度 → 都道府県名）
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ja&zoom=5&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`逆ジオコーディングに失敗しました (${response.status})`);
    }
    
    const data = await response.json();
    
    // 都道府県名を取得
    const state = data.address?.state;
    if (state) {
      return state;
    }
    
    return null;
  } catch (error) {
    console.error("逆ジオコーディングエラー:", error);
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

        // 逆ジオコーディングで都道府県名を取得
        const prefectureName = await reverseGeocode(latitude, longitude);
        
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
