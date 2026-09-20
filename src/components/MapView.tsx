import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { prefectureCoordinates } from "../data/prefectureCoordinates";
import { prefectures } from "../data/prefectures";

interface MapViewProps {
  selectedCode: string;
  onCodeChange: (code: string) => void;
  onClose: () => void;
}

export function MapView({ selectedCode, onCodeChange, onClose }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // 地図を初期化（日本中心）
    const map = L.map(mapRef.current).setView([36.5, 138.0], 5);
    mapInstanceRef.current = map;

    // OpenStreetMapのタイルを追加
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // 都道府県マーカーを追加
    Object.entries(prefectureCoordinates).forEach(([code, coords]) => {
      const prefecture = prefectures.find((p) => p.code === code);
      if (!prefecture) return;

      const isSelected = selectedCode === code;

      // マーカーの色を選択状態に応じて変更
      const markerColor = isSelected ? "#3b82f6" : "#ffffff";
      const markerSize = isSelected ? 12 : 8;

      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: markerSize,
        fillColor: markerColor,
        color: isSelected ? "#1e40af" : "#6b7280",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      // ツールチップを追加
      marker.bindTooltip(prefecture.name, {
        permanent: false,
        direction: "top",
        offset: [0, -10],
      });

      // クリックイベント
      marker.on("click", () => {
        onCodeChange(code);
        onClose();
      });
    });

    // クリーンアップ
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedCode, onCodeChange, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-dark rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                fill="white"
              />
            </svg>
            地図から選択
          </h2>
          <button
            onClick={onClose}
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

        <div
          ref={mapRef}
          className="flex-1 rounded-2xl overflow-hidden"
          style={{ minHeight: "500px" }}
        />

        <p className="text-xs text-white/60 text-center mt-4">
          マーカーをクリックして都道府県を選択 • マウスホイールでズーム • ドラッグで移動
        </p>
      </div>
    </div>
  );
}
