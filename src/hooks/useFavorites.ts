import { useState, useEffect } from 'react';

export interface FavoriteLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  addedAt: number;
}

const STORAGE_KEY = 'weather-app-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  // localStorageから読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // localStorageに保存
  const saveToFavorites = (newFavorites: FavoriteLocation[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const addFavorite = (location: Omit<FavoriteLocation, 'id' | 'addedAt'>) => {
    const newFavorite: FavoriteLocation = {
      ...location,
      id: `${location.latitude}-${location.longitude}`,
      addedAt: Date.now(),
    };
    
    // 重複チェック
    const exists = favorites.some(f => f.id === newFavorite.id);
    if (!exists) {
      saveToFavorites([...favorites, newFavorite]);
    }
  };

  const removeFavorite = (id: string) => {
    saveToFavorites(favorites.filter(f => f.id !== id));
  };

  const isFavorite = (latitude: number, longitude: number) => {
    const id = `${latitude}-${longitude}`;
    return favorites.some(f => f.id === id);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
