import { useState } from 'react';

export interface SearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

export function useLocationSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Open-Meteo Geocoding API
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=ja&format=json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('検索に失敗しました');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索エラー');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
}
