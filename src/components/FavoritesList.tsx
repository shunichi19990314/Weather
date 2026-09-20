import { useEffect, useState } from 'react';
import { FavoriteLocation } from '../hooks/useFavorites';
import { WeatherIcon } from './WeatherIcon';
import { UIIcon } from './UIIcon';

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  onSelect: (lat: number, lng: number, name: string) => void;
  onRemove: (id: string) => void;
}

interface FavoriteWeather {
  [key: string]: {
    temperature: number;
    weather_code: number;
  };
}

export function FavoritesList({ favorites, onSelect, onRemove }: FavoritesListProps) {
  const [weatherData, setWeatherData] = useState<FavoriteWeather>({});

  useEffect(() => {
    const fetchWeatherForFavorites = async () => {
      const newWeatherData: FavoriteWeather = {};

      for (const fav of favorites) {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${fav.latitude}&longitude=${fav.longitude}&current=temperature_2m,weather_code&timezone=auto`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            newWeatherData[fav.id] = {
              temperature: Math.round(data.current.temperature_2m),
              weather_code: data.current.weather_code,
            };
          }
        } catch (error) {
          console.error('Failed to fetch weather for favorite:', error);
        }
      }

      setWeatherData(newWeatherData);
    };

    if (favorites.length > 0) {
      fetchWeatherForFavorites();
    }
  }, [favorites]);

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="glass rounded-2xl p-6 mb-6">
      <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        お気に入り地点
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {favorites.map((fav) => {
          const weather = weatherData[fav.id];
          return (
            <div
              key={fav.id}
              className="glass rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer relative group"
              onClick={() => onSelect(fav.latitude, fav.longitude, fav.name)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(fav.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-white font-medium text-sm mb-1 truncate">
                    {fav.name}
                  </div>
                  {weather ? (
                    <div className="flex items-center gap-2">
                      <WeatherIcon code={String(weather.weather_code)} size={24} />
                      <span className="text-white text-lg">{weather.temperature}°</span>
                    </div>
                  ) : (
                    <div className="text-white/50 text-sm">読み込み中...</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
