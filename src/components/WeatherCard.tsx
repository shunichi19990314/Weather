import { DailyForecast } from "../types/weather";
import { getWeatherEmoji, getWeatherBgClass } from "../utils/weather";

interface WeatherCardProps {
  forecast: DailyForecast;
  index: number;
}

export function WeatherCard({ forecast, index }: WeatherCardProps) {
  const emoji = getWeatherEmoji(forecast.weatherCode);
  const bgClass = getWeatherBgClass(forecast.weatherCode);

  return (
    <div
      className={`bg-gradient-to-br ${bgClass} rounded-2xl p-6 shadow-lg border border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="text-center">
        {/* 日付ラベル */}
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-600">{forecast.dateLabel}</span>
          <span className="ml-2 text-xs text-gray-500">({forecast.date})</span>
        </div>

        {/* 天気アイコン */}
        <div className="text-6xl my-4 drop-shadow-md">{emoji}</div>

        {/* 天気テキスト */}
        <p className="text-sm font-medium text-gray-700 mb-3 leading-relaxed line-clamp-2">
          {forecast.weather}
        </p>

        {/* 降水確率 */}
        <div className="flex items-center justify-center mb-2">
          <span className="text-xs text-gray-500 mr-1">💧</span>
          <span className="text-lg font-bold text-blue-600">{forecast.pop}%</span>
        </div>

        {/* 気温 */}
        <div className="flex items-center justify-center gap-3 mt-3">
          {forecast.tempMax !== "--" && (
            <div className="flex items-center">
              <span className="text-xs text-red-500 mr-1">▲</span>
              <span className="text-sm font-bold text-red-600">{forecast.tempMax}°C</span>
            </div>
          )}
          {forecast.tempMin !== "--" && (
            <div className="flex items-center">
              <span className="text-xs text-blue-500 mr-1">▼</span>
              <span className="text-sm font-bold text-blue-600">{forecast.tempMin}°C</span>
            </div>
          )}
        </div>

        {/* 風・波情報 */}
        {(forecast.wind || forecast.wave) && (
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            {forecast.wind && (
              <p className="text-xs text-gray-500">🌬️ {forecast.wind}</p>
            )}
            {forecast.wave && (
              <p className="text-xs text-gray-500 mt-1">🌊 {forecast.wave}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
