import { useState, useEffect, useCallback } from "react";
import { DailyForecast, OverviewForecast } from "../types/weather";

const FORECAST_BASE_URL = "https://www.jma.go.jp/bosai/forecast/data/forecast";
const OVERVIEW_BASE_URL = "https://www.jma.go.jp/bosai/forecast/data/overview_forecast";

// CORSプロキシのリスト（順番に試す）
const CORS_PROXIES = [
  (url: string) => url, // まず直接アクセス
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

interface UseWeatherResult {
  forecasts: DailyForecast[];
  overview: OverviewForecast | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

function parseForecastData(data: any[]): DailyForecast[] {
  if (!data || data.length === 0) {
    console.warn("No data received");
    return [];
  }

  const forecasts: DailyForecast[] = [];
  const timeSeries = data[0]?.timeSeries || [];

  console.log("TimeSeries count:", timeSeries.length);
  console.log("TimeSeries structure:", timeSeries);

  // 天気予報（timeSeries[0]）
  const weatherSeries = timeSeries[0];
  // 気温予報（timeSeries[1]）- 存在しない場合もある
  const tempSeries = timeSeries[1];

  if (!weatherSeries || !weatherSeries.timeDefines) {
    console.warn("No weather series data");
    return [];
  }

  const dateLabels = ["今日", "明日", "明後日"];

  weatherSeries.timeDefines.forEach((time: string, index: number) => {
    const area = weatherSeries.areas?.[0];
    
    // 気温データの抽出（構造が異なる場合に対応）
    let tempMin = "--";
    let tempMax = "--";
    
    if (tempSeries && tempSeries.areas && tempSeries.areas[0]) {
      const tempArea = tempSeries.areas[0];
      
      // tempsMinとtempsMaxの構造を確認
      if (tempArea.tempsMin && tempArea.tempsMin.temps) {
        tempMin = tempArea.tempsMin.temps[index] || "--";
      }
      if (tempArea.tempsMax && tempArea.tempsMax.temps) {
        tempMax = tempArea.tempsMax.temps[index] || "--";
      }
    }

    const date = new Date(time);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 降水確率の取得
    const pop = area?.pops?.[index];
    const popValue = pop !== undefined && pop !== null ? pop : "--";

    forecasts.push({
      date: `${month}/${day}`,
      dateLabel: dateLabels[index] || `${month}/${day}`,
      weather: area?.weathers?.[index] || "情報なし",
      weatherCode: area?.weatherCodes?.[index] || "100",
      wind: area?.winds?.[index] || "",
      wave: area?.waves?.[index] || "",
      pop: popValue,
      tempMin: tempMin,
      tempMax: tempMax,
    });
  });

  console.log("Parsed forecasts:", forecasts);
  return forecasts;
}

async function fetchWithCorsFallback(url: string): Promise<any> {
  let lastError: Error | null = null;

  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(url);
      const response = await fetch(proxyUrl);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e: any) {
      lastError = e;
      continue;
    }
  }

  throw lastError || new Error("すべての接続方法でデータの取得に失敗しました");
}

export function useWeather(areaCode: string): UseWeatherResult {
  const [forecasts, setForecasts] = useState<DailyForecast[]>([]);
  const [overview, setOverview] = useState<OverviewForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!areaCode) return;

    setLoading(true);
    setError(null);

    try {
      // 天気予報の取得
      const forecastUrl = `${FORECAST_BASE_URL}/${areaCode}.json`;
      const forecastData = await fetchWithCorsFallback(forecastUrl);
      const parsedForecasts = parseForecastData(forecastData);
      setForecasts(parsedForecasts);

      // 週間予報概要の取得
      const overviewUrl = `${OVERVIEW_BASE_URL}/${areaCode}.json`;
      const overviewData = await fetchWithCorsFallback(overviewUrl);
      setOverview(overviewData);

      // 更新時刻
      const now = new Date();
      setLastUpdated(
        `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      );
    } catch (err: any) {
      setError(err.message || "データの取得に失敗しました");
      setForecasts([]);
      setOverview(null);
    } finally {
      setLoading(false);
    }
  }, [areaCode]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { forecasts, overview, loading, error, lastUpdated };
}
