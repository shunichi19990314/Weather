import { useState } from "react";
import { useWeather } from "./hooks/useWeather";
import { WeatherCard } from "./components/WeatherCard";
import { WeeklyOverview } from "./components/WeeklyOverview";
import { RegionSelector } from "./components/RegionSelector";
import { prefectures } from "./data/prefectures";

function App() {
  const [selectedCode, setSelectedCode] = useState("130000"); // デフォルト: 東京都

  const { forecasts, overview, loading, error, lastUpdated } = useWeather(selectedCode);

  const selectedPrefecture = prefectures.find((p) => p.code === selectedCode);

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
        {/* 地域選択 */}
        <div className="mb-8">
          <RegionSelector selectedCode={selectedCode} onCodeChange={setSelectedCode} />
        </div>

        {/* 選択中の地域表示 */}
        {selectedPrefecture && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedPrefecture.name}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({selectedPrefecture.region})
              </span>
            </h2>
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin text-5xl mb-4">🌀</div>
              <p className="text-gray-600 font-medium">天気データを取得中...</p>
            </div>
          </div>
        )}

        {/* エラー */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <span className="text-4xl mb-3 block">⚠️</span>
              <p className="text-red-700 font-medium mb-2">データの取得に失敗しました</p>
              <p className="text-red-600 text-sm">{error}</p>
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
        {!loading && !error && forecasts.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {forecasts.map((forecast, index) => (
                <WeatherCard key={index} forecast={forecast} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* 週間予報解説 */}
        {!loading && !error && overview && (
          <div className="mb-8">
            <WeeklyOverview overview={overview} />
          </div>
        )}

        {/* 空の状態 */}
        {!loading && !error && forecasts.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-gray-600">地域を選択してください</p>
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
            {" "}｜ 天気予報データは気象庁のオープンデータを利用しています
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
