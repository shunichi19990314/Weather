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

// ハバーサイン距離を計算（2点間の距離をkmで返す）
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 座標から最も近い都道府県を判定
function getNearestPrefecture(lat: number, lng: number): string | null {
  let nearestCode: string | null = null;
  let minDistance = Infinity;

  Object.entries(prefectureCoordinates).forEach(([code, coords]) => {
    const distance = haversineDistance(lat, lng, coords.lat, coords.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCode = code;
    }
  });

  return nearestCode;
}

export function MapView({ selectedCode, onCodeChange, onClose }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clickMarkerRef = useRef<L.Marker | null>(null);

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

      // マーカークリックイベント
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        onCodeChange(code);
        onClose();
      });
    });

    // 地図クリックイベント（任意の場所をクリック）
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // クリック位置にマーカーを追加
      if (clickMarkerRef.current) {
        map.removeLayer(clickMarkerRef.current);
      }
      
      clickMarkerRef.current = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "custom-click-marker",
          html: `<div style="width: 20px; height: 20px; background: rgba(59, 130, 246, 0.8); border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map);

      // クリック座標から最も近い都道府県を判定
      const nearestCode = getNearestPrefecture(lat, lng);
      if (nearestCode) {
        const prefecture = prefectures.find((p) => p.code === nearestCode);
        
        // ツールチップで都道府県名を表示
        if (clickMarkerRef.current && prefecture) {
          clickMarkerRef.current.bindTooltip(
            `${prefecture.name} の天気`,
            { permanent: true, direction: "top", offset: [0, -10] }
          ).openTooltip();
          
          // クリックマーカーもクリック可能にする
          clickMarkerRef.current.on("click", () => {
            onCodeChange(nearestCode);
            onClose();
          });
        }
      }
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
          地図上の任意の場所をクリック • マウスホイールでズーム • ドラッグで移動
        </p>
      </div>
    </div>
  );
}
