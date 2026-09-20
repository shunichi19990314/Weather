import { useState } from 'react';
import { useLocationSearch } from '../hooks/useLocationSearch';
import { UIIcon } from './UIIcon';

interface LocationSearchProps {
  onSelect: (lat: number, lng: number, name: string) => void;
  onClose: () => void;
}

export function LocationSearch({ onSelect, onClose }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const { results, loading, error, search, clearResults } = useLocationSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const handleSelect = (result: { latitude: number; longitude: number; name: string; admin1?: string; country: string }) => {
    const fullName = [result.name, result.admin1, result.country].filter(Boolean).join(', ');
    onSelect(result.latitude, result.longitude, fullName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-dark rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <UIIcon type="search" size={24} className="text-white" />
            地点を検索
          </h2>
          <button
            onClick={() => {
              clearResults();
              onClose();
            }}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="都市名を入力（例：東京、大阪、札幌）"
              className="flex-1 px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 glass rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {loading ? '検索中...' : '検索'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full p-4 glass rounded-lg text-left hover:bg-white/20 transition-colors"
                >
                  <div className="text-white font-medium">{result.name}</div>
                  <div className="text-white/70 text-sm">
                    {[result.admin2, result.admin1, result.country].filter(Boolean).join(', ')}
                  </div>
                  <div className="text-white/50 text-xs mt-1">
                    緯度: {result.latitude.toFixed(4)}, 経度: {result.longitude.toFixed(4)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-12">
                <UIIcon type="search" size={48} className="text-white/30 mx-auto mb-4" />
                <p className="text-white/70">都市名を入力して検索してください</p>
                <p className="text-white/50 text-sm mt-2">例：東京、大阪、札幌、ニューヨーク</p>
              </div>
            )
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-4xl mb-4">🔄</div>
              <p className="text-white/70">検索中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
