import { useState, useEffect } from "react";
import { useWeather } from "./hooks/useWeather";
import { useGeolocation } from "./hooks/useGeolocation";
import { WeatherCard } from "./components/WeatherCard";
import { WeeklyOverview } from "./components/WeeklyOverview";
import { RegionSelector } from "./components/RegionSelector";
import { prefectures } from "./data/prefectures";

function App() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isManualSelection, setIsManualSelection] = useState(false);

  // 位置情報取得
  const {
    latitude,
    longitude,
    prefectureName,
    cityName,
    areaCode: geoAreaCode,
    loading: geoLoading,
    error: geoError,
    retry: retryGeolocation,
  } = useGeolocation();

  // 位置情報から自動設定されたコード
  useEffect(() => {
    if (geoAreaCode && !isManualSelection) {
      setSelectedCode(geoAreaCode);
    }
  }, [geoAreaCode, isManualSelection]);

  // 天気データ取得
  const { forecasts, overview, loading: weatherLoading, error: weatherError, lastUpdated } =
    useWeather(selectedCode || "");

  const selectedPrefecture = selectedCode
    ? prefectures.find((p) => p.code === selectedCode)
    : null;

  // 手動選択ハンドラ
  const handleManualSelect = (code: string) => {
    setIsManualSelection(true);
    setSelectedCode(code);
  };

  // 現在地にリセット
  const handleResetToCurrentLocation = () => {
    setIsManualSelection(false);
    if (geoAreaCode) {
      setSelectedCode(geoAreaCode);
    } else {
      retryGeolocation();
    }
  };

  // ローディング状態
  const isLoading = geoLoading || (weatherLoading && selectedCode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌤️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">天気予報</h1>
                <p className="text-xs text-gray-500">気象庁データ提供</p>
              </div>
            </div>
            {lastUpdated && (
              <div className="text-xs text-gray-400">
                最終更新: {lastUpdated}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 位置情報ステータス */}
        {!isManualSelection && (
          <div className="mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    {geoLoading && (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin text-lg">🔄</div>
                        <p className="text-sm text-gray-600">現在地を取得中...</p>
                      </div>
                    )}
                    {geoError && !geoLoading && (
                      <div>
                        <p className="text-sm text-red-600 font-medium">位置情報の取得に失敗</p>
                        <p className="text-xs text-gray-500 mt-1">{geoError}</p>
                        {latitude !== null && longitude !== null && (
                          <p className="text-xs text-gray-400 mt-1">
                            緯度: {latitude.toFixed(4)}, 経度: {longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                    )}
                    {!geoLoading && !geoError && prefectureName && (
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          現在地: {prefectureName}{cityName ? ` ${cityName}` : ""}
                        </p>
                        {latitude && longitude && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            緯度: {latitude.toFixed(4)}, 経度: {longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {geoError && (
                  <button
                    onClick={retryGeolocation}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    再試行
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 手動選択ボタン */}
        {selectedCode && !isManualSelection && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setIsManualSelection(true)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-white transition-colors"
            >
              🗺️ 地域を手動で選択
            </button>
          </div>
        )}

        {/* 現在地に戻るボタン */}
        {isManualSelection && geoAreaCode && (
          <div className="mb-6 text-center">
            <button
              onClick={handleResetToCurrentLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors shadow-md"
            >
              📍 現在地の天気に戻る
            </button>
          </div>
        )}

        {/* 地域選択（手動選択時のみ表示） */}
        {isManualSelection && (
          <div className="mb-8">
            <RegionSelector selectedCode={selectedCode || ""} onCodeChange={handleManualSelect} />
          </div>
        )}

        {/* 選択中の地域表示 */}
        {selectedPrefecture && !isLoading && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isManualSelection ? "🗺️ " : "📍 "}
              {selectedPrefecture.name}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({selectedPrefecture.region})
              </span>
            </h2>
          </div>
        )}

        {/* ローディング */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin text-5xl mb-4">🌀</div>
              <p className="text-gray-600 font-medium">
                {geoLoading ? "現在地を取得中..." : "天気データを取得中..."}
              </p>
            </div>
          </div>
        )}

        {/* エラー */}
        {weatherError && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <span className="text-4xl mb-3 block">⚠️</span>
              <p className="text-red-700 font-medium mb-2">データの取得に失敗しました</p>
              <p className="text-red-600 text-sm">{weatherError}</p>
              <p className="text-gray-500 text-xs mt-3">
                気象庁のAPIが一時的に利用できない可能性があります。しばらく待ってから再度お試しください。
              </p>
              <button
                onClick={() => setSelectedCode(selectedCode)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                再読み込み
              </button>
            </div>
          </div>
        )}

        {/* 天気予報カード */}
        {!isLoading && !weatherError && forecasts.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {forecasts.map((forecast, index) => (
                <WeatherCard key={index} forecast={forecast} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* 週間予報解説 */}
        {!isLoading && !weatherError && overview && (
          <div className="mb-8">
            <WeeklyOverview overview={overview} />
          </div>
        )}

        {/* 空の状態 */}
        {!isLoading && !weatherError && forecasts.length === 0 && !selectedCode && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-gray-600">位置情報を取得できませんでした</p>
            <p className="text-sm text-gray-500 mt-2">
              地域を手動で選択してください
            </p>
            <button
              onClick={() => setIsManualSelection(true)}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              地域を選択
            </button>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/50 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            データ提供:{" "}
            <a
              href="https://www.jma.go.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              気象庁
            </a>
            {" "}｜ 位置情報:{" "}
            <a
              href="https://www.openstreetmap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenStreetMap
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
