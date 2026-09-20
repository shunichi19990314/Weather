import { useState, useEffect } from "react";
import { useWeather } from "./hooks/useWeather";
import { useGeolocation } from "./hooks/useGeolocation";
import { RegionSelector } from "./components/RegionSelector";
import { WeatherIcon } from "./components/WeatherIcon";
import { UIIcon } from "./components/UIIcon";
import { MapView } from "./components/MapView";
import { prefectures } from "./data/prefectures";
import { getWeatherDescription } from "./utils/weather";

function App() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const {
    latitude,
    longitude,
    accuracy,
    prefectureName,
    cityName,
    wardName,
    areaCode: geoAreaCode,
    loading: geoLoading,
    error: geoError,
    retry: retryGeolocation,
  } = useGeolocation();

  useEffect(() => {
    if (geoAreaCode && !isManualSelection) {
      setSelectedCode(geoAreaCode);
    }
  }, [geoAreaCode, isManualSelection]);

  const { forecasts, overview, loading: weatherLoading, error: weatherError, lastUpdated } =
    useWeather(selectedCode || "");

  const selectedPrefecture = selectedCode
    ? prefectures.find((p) => p.code === selectedCode)
    : null;

  const handleResetToCurrentLocation = () => {
    setIsManualSelection(false);
    if (geoAreaCode) {
      setSelectedCode(geoAreaCode);
    } else {
      retryGeolocation();
    }
  };

  const handleMapSelect = (code: string) => {
    setIsManualSelection(true);
    setSelectedCode(code);
  };

  const isLoading = geoLoading || (weatherLoading && selectedCode);

  // 現在の天気情報を取得
  const currentForecast = forecasts[0];
  const weatherCode = currentForecast?.weatherCode || "100";
  const weatherDescription = getWeatherDescription(weatherCode);

  // 背景グラデーションを決定
  const getBackgroundGradient = () => {
    const codeNum = parseInt(weatherCode);
    if (codeNum >= 100 && codeNum < 200) return "gradient-sunny";
    if (codeNum >= 200 && codeNum < 300) return "gradient-cloudy";
    if (codeNum >= 300 && codeNum < 400) return "gradient-rainy";
    if (codeNum >= 400 && codeNum < 500) return "gradient-snowy";
    return "gradient-sunny";
  };

  const locationName = isManualSelection
    ? selectedPrefecture?.name
    : prefectureName
    ? `${prefectureName}${cityName ? ` ${cityName}` : ""}${wardName ? ` ${wardName}` : ""}`
    : "";

  return (
    <div className={`min-h-screen ${getBackgroundGradient()} transition-all duration-1000`}>
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 glass-dark">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WeatherIcon code="100" size={28} />
              <h1 className="text-lg font-semibold text-white">天気</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMap(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full glass hover:bg-white/20 transition-colors text-white text-sm"
              >
                <UIIcon type="location" size={16} className="text-white" />
                <span>地図</span>
              </button>
              {lastUpdated && (
                <div className="text-xs text-white/70">
                  更新: {lastUpdated}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 位置情報ステータス */}
        {!isManualSelection && (
          <div className="mb-6">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UIIcon type="location" size={24} className="text-white" />
                  <div>
                    {geoLoading && (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin text-base">🔄</div>
                        <p className="text-sm text-white/90">現在地を取得中...</p>
                      </div>
                    )}
                    {geoError && !geoLoading && (
                      <div>
                        <p className="text-sm text-white/90 font-medium">位置情報の取得に失敗</p>
                        <p className="text-xs text-white/70 mt-1">{geoError}</p>
                      </div>
                    )}
                    {!geoLoading && !geoError && locationName && (
                      <div>
                        <p className="text-sm font-medium text-white">
                          {locationName}
                        </p>
                        {latitude && longitude && (
                          <div className="text-xs text-white/70 mt-0.5 space-y-0.5">
                            <p>緯度: {latitude.toFixed(6)}, 経度: {longitude.toFixed(6)}</p>
                            {accuracy !== null && (
                              <p className="flex items-center gap-1">
                                <span>精度:</span>
                                <span className={`font-medium ${
                                  accuracy < 50 ? "text-green-300" :
                                  accuracy < 200 ? "text-yellow-300" :
                                  "text-orange-300"
                                }`}>
                                  ±{Math.round(accuracy)}m
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {geoError && (
                  <button
                    onClick={retryGeolocation}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
                  >
                    再試行
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 手動選択/現在地に戻るボタン */}
        <div className="mb-6 flex gap-2 justify-center">
          {!isManualSelection && selectedCode && (
            <button
              onClick={() => setIsManualSelection(true)}
              className="px-4 py-2 glass text-white text-sm rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <UIIcon type="search" size={16} className="text-white" />
              <span>地域を選択</span>
            </button>
          )}
          {isManualSelection && geoAreaCode && (
            <button
              onClick={handleResetToCurrentLocation}
              className="px-4 py-2 glass text-white text-sm rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <UIIcon type="location" size={16} className="text-white" />
              <span>現在地に戻る</span>
            </button>
          )}
        </div>

        {/* 地域選択 */}
        {isManualSelection && (
          <div className="mb-6">
            <RegionSelector selectedCode={selectedCode || ""} onCodeChange={handleMapSelect} />
          </div>
        )}

        {/* ローディング */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block mb-4">
                <svg width="64" height="64" viewBox="0 0 64 64" className="animate-spin">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                  <path
                    d="M32 4 A28 28 0 0 1 60 32"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-white/90 font-medium text-lg">
                {geoLoading ? "現在地を取得中..." : "天気データを取得中..."}
              </p>
            </div>
          </div>
        )}

        {/* エラー */}
        {weatherError && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="mb-3 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <path
                    d="M24 4L2 44h44L24 4z"
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <line x1="24" y1="18" x2="24" y2="30" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="24" cy="36" r="2" fill="#FBBF24" />
                </svg>
              </div>
              <p className="text-white font-medium mb-2 text-lg">データの取得に失敗しました</p>
              <p className="text-white/80 text-sm">{weatherError}</p>
              <button
                onClick={() => setSelectedCode(selectedCode)}
                className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors flex items-center gap-2 mx-auto"
              >
                <UIIcon type="refresh" size={16} className="text-white" />
                <span>再読み込み</span>
              </button>
            </div>
          </div>
        )}

        {/* 天気予報表示 */}
        {!isLoading && !weatherError && currentForecast && (
          <div className="space-y-6 animate-fade-in">
            {/* 現在の天気 - 大きな表示 */}
            <div className="text-center py-8">
              <h2 className="text-3xl font-light text-white mb-2">
                {locationName}
              </h2>
              <div className="text-8xl font-thin text-white mb-4">
                {currentForecast.tempMax !== "--" ? `${currentForecast.tempMax}°` : "--°"}
              </div>
              <div className="mb-4 flex justify-center">
                <WeatherIcon code={weatherCode} size={120} />
              </div>
              <p className="text-xl text-white/90 mb-2">
                {currentForecast.weather}
              </p>
              <div className="flex items-center justify-center gap-4 text-white/80">
                {currentForecast.tempMax !== "--" && (
                  <span>最高: {currentForecast.tempMax}°</span>
                )}
                {currentForecast.tempMin !== "--" && (
                  <span>最低: {currentForecast.tempMin}°</span>
                )}
              </div>
            </div>

            {/* 詳細情報カード */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-4">
                詳細情報
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-white/60 mb-1 flex items-center gap-1">
                    <UIIcon type="rain" size={14} className="text-blue-300" />
                    <span>降水確率</span>
                  </div>
                  <div className="text-2xl font-light text-white">{currentForecast.pop !== "--" ? `${currentForecast.pop}%` : "--"}</div>
                </div>
                {currentForecast.wind && (
                  <div>
                    <div className="text-xs text-white/60 mb-1 flex items-center gap-1">
                      <UIIcon type="wind" size={14} className="text-gray-300" />
                      <span>風</span>
                    </div>
                    <div className="text-sm font-light text-white">{currentForecast.wind}</div>
                  </div>
                )}
                {currentForecast.wave && (
                  <div>
                    <div className="text-xs text-white/60 mb-1 flex items-center gap-1">
                      <UIIcon type="wave" size={14} className="text-blue-300" />
                      <span>波</span>
                    </div>
                    <div className="text-sm font-light text-white">{currentForecast.wave}</div>
                  </div>
                )}
              </div>
            </div>

            {/* 3日間の予報 */}
            {forecasts.length > 1 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-4">
                  3日間の予報
                </h3>
                <div className="space-y-3">
                  {forecasts.slice(1).map((forecast, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <WeatherIcon code={forecast.weatherCode} size={32} />
                        <div>
                          <div className="text-white font-medium">{forecast.dateLabel}</div>
                          <div className="text-xs text-white/70">{forecast.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {forecast.tempMax !== "--" && (
                            <div className="text-white font-light">{forecast.tempMax}°</div>
                          )}
                          {forecast.tempMin !== "--" && (
                            <div className="text-xs text-white/70">{forecast.tempMin}°</div>
                          )}
                        </div>
                        <div className="text-xs text-white/70 w-12 text-right flex items-center justify-end gap-0.5">
                          <UIIcon type="rain" size={12} className="text-blue-300" />
                          <span>{forecast.pop !== "--" ? `${forecast.pop}%` : "--"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 週間予報解説 */}
            {overview && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-4">
                  週間予報解説
                </h3>
                {overview.headlineText && (
                  <div className="mb-3 p-3 bg-white/10 rounded-lg">
                    <p className="text-sm text-white font-medium">
                      {overview.headlineText}
                    </p>
                  </div>
                )}
                <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                  {overview.text}
                </p>
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/50">
                    発表元: {overview.publishingOffice}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 空の状態 */}
        {!isLoading && !weatherError && forecasts.length === 0 && !selectedCode && (
          <div className="text-center py-20">
            <div className="mb-4 flex justify-center">
              <UIIcon type="search" size={64} className="text-white/70" />
            </div>
            <p className="text-white/90 text-lg mb-2">位置情報を取得できませんでした</p>
            <p className="text-sm text-white/70 mb-4">
              地域を手動で選択してください
            </p>
            <button
              onClick={() => setIsManualSelection(true)}
              className="px-6 py-2 glass text-white rounded-lg text-sm hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
            >
              <UIIcon type="search" size={16} className="text-white" />
              <span>地域を選択</span>
            </button>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="mt-12 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-white/50">
            データ提供:{" "}
            <a
              href="https://www.jma.go.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline"
            >
              気象庁
            </a>
            {" "}｜ 位置情報:{" "}
            <a
              href="https://www.openstreetmap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline"
            >
              OpenStreetMap
            </a>
          </p>
        </div>
      </footer>

      {/* 地図モーダル */}
      {showMap && (
        <MapView
          selectedCode={selectedCode || ""}
          onCodeChange={handleMapSelect}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}

export default App;
