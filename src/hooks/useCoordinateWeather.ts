import { useState, useEffect } from 'react';

export interface CoordinateWeatherData {
  latitude: number;
  longitude: number;
  locationName: string;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    uv_index: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    uv_index_max: number[];
  };
}

export function useCoordinateWeather(latitude: number | null, longitude: number | null) {
  const [data, setData] = useState<CoordinateWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) {
      setData(null);
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Open-Meteo APIから天気予報を取得（現在地 + 日次予報）
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=3`;
        
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
          throw new Error('天気データの取得に失敗しました');
        }
        
        const weatherData = await weatherResponse.json();

        // Nominatim APIで場所の名前を取得
        const locationUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ja`;
        
        const locationResponse = await fetch(locationUrl, {
          headers: {
            'User-Agent': 'WeatherApp/1.0'
          }
        });
        
        let locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        if (locationResponse.ok) {
          const locationData = await locationResponse.json();
          const address = locationData.address;
          
          // 市区町村名を構築
          const parts = [];
          if (address.city) parts.push(address.city);
          else if (address.town) parts.push(address.town);
          else if (address.village) parts.push(address.village);
          else if (address.county) parts.push(address.county);
          
          if (address.state) parts.push(address.state);
          
          if (parts.length > 0) {
            locationName = parts.join(' ');
          }
        }

        setData({
          latitude,
          longitude,
          locationName,
          current: weatherData.current,
          daily: weatherData.daily
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { data, loading, error };
}
