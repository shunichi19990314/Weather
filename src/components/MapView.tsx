import { useState, useRef, useEffect } from "react";
import { prefectures } from "../data/prefectures";
import { UIIcon } from "./UIIcon";

interface MapViewProps {
  selectedCode: string;
  onCodeChange: (code: string) => void;
  onClose: () => void;
}

// 都道府県の簡略化された座標データ（SVG座標系）
const PREFECTURE_POSITIONS: Record<string, { x: number; y: number; width: number; height: number }> = {
  // 北海道
  "011000": { x: 380, y: 30, width: 80, height: 60 },
  "012000": { x: 340, y: 50, width: 60, height: 50 },
  "016000": { x: 300, y: 70, width: 60, height: 50 },
  "013000": { x: 420, y: 60, width: 60, height: 50 },
  "014100": { x: 450, y: 80, width: 60, height: 50 },
  "015000": { x: 360, y: 90, width: 60, height: 50 },
  "017000": { x: 280, y: 90, width: 60, height: 50 },
  
  // 東北
  "020000": { x: 340, y: 140, width: 50, height: 40 },
  "030000": { x: 360, y: 160, width: 50, height: 40 },
  "040000": { x: 370, y: 180, width: 50, height: 40 },
  "050000": { x: 330, y: 170, width: 50, height: 40 },
  "060000": { x: 340, y: 190, width: 50, height: 40 },
  "070000": { x: 350, y: 210, width: 50, height: 40 },
  
  // 関東甲信
  "080000": { x: 380, y: 230, width: 40, height: 35 },
  "090000": { x: 360, y: 230, width: 40, height: 35 },
  "100000": { x: 340, y: 230, width: 40, height: 35 },
  "110000": { x: 350, y: 250, width: 40, height: 35 },
  "120000": { x: 390, y: 250, width: 40, height: 35 },
  "130000": { x: 360, y: 265, width: 35, height: 30 },
  "140000": { x: 360, y: 280, width: 40, height: 30 },
  "190000": { x: 330, y: 265, width: 35, height: 30 },
  "200000": { x: 310, y: 250, width: 40, height: 35 },
  
  // 北陸
  "150000": { x: 300, y: 200, width: 40, height: 40 },
  "160000": { x: 280, y: 220, width: 35, height: 35 },
  "170000": { x: 260, y: 230, width: 35, height: 35 },
  "180000": { x: 250, y: 250, width: 35, height: 35 },
  
  // 東海
  "210000": { x: 280, y: 270, width: 40, height: 35 },
  "220000": { x: 310, y: 290, width: 45, height: 35 },
  "230000": { x: 290, y: 295, width: 40, height: 35 },
  "240000": { x: 270, y: 300, width: 40, height: 35 },
  
  // 近畿
  "250000": { x: 250, y: 280, width: 35, height: 35 },
  "260000": { x: 240, y: 295, width: 35, height: 35 },
  "270000": { x: 230, y: 310, width: 35, height: 35 },
  "280000": { x: 215, y: 305, width: 35, height: 35 },
  "290000": { x: 245, y: 315, width: 35, height: 35 },
  "300000": { x: 230, y: 330, width: 35, height: 35 },
  
  // 中国
  "310000": { x: 190, y: 290, width: 35, height: 35 },
  "320000": { x: 160, y: 295, width: 40, height: 35 },
  "330000": { x: 180, y: 310, width: 35, height: 35 },
  "340000": { x: 155, y: 315, width: 40, height: 35 },
  
  // 四国
  "360000": { x: 200, y: 340, width: 35, height: 30 },
  "370000": { x: 180, y: 340, width: 35, height: 30 },
  "380000": { x: 150, y: 345, width: 40, height: 30 },
  "390000": { x: 170, y: 360, width: 40, height: 30 },
  
  // 九州
  "350000": { x: 120, y: 320, width: 35, height: 35 },
  "400000": { x: 110, y: 345, width: 35, height: 35 },
  "410000": { x: 90, y: 350, width: 35, height: 35 },
  "420000": { x: 70, y: 355, width: 35, height: 35 },
  "430000": { x: 100, y: 370, width: 35, height: 35 },
  "440000": { x: 130, y: 365, width: 35, height: 35 },
  "450000": { x: 120, y: 385, width: 35, height: 35 },
  "460100": { x: 100, y: 400, width: 35, height: 35 },
  
  // 沖縄
  "471000": { x: 60, y: 450, width: 30, height: 25 },
  "472000": { x: 100, y: 440, width: 30, height: 25 },
  "473000": { x: 80, y: 460, width: 30, height: 25 },
  "474000": { x: 50, y: 470, width: 30, height: 25 },
};

export function MapView({ selectedCode, onCodeChange, onClose }: MapViewProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 5;
  const BASE_VIEWBOX = { width: 500, height: 500 };

  // Calculate viewBox based on zoom and pan
  const getViewBox = () => {
    const width = BASE_VIEWBOX.width / zoom;
    const height = BASE_VIEWBOX.height / zoom;
    const x = (BASE_VIEWBOX.width - width) / 2 - pan.x;
    const y = (BASE_VIEWBOX.height - height) / 2 - pan.y;
    return `${x} ${y} ${width} ${height}`;
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.3, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.3, MIN_ZOOM));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.min(Math.max(prev * delta, MIN_ZOOM), MAX_ZOOM));
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setLastPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = (e.clientX - lastPos.x) / zoom;
      const dy = (e.clientY - lastPos.y) / zoom;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const dx = (e.touches[0].clientX - lastPos.x) / zoom;
      const dy = (e.touches[0].clientY - lastPos.y) / zoom;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handlePrefectureClick = (code: string) => {
    if (!isDragging) {
      onCodeChange(code);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-dark rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <UIIcon type="location" size={24} className="text-white" />
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

        <div className="relative bg-white/5 rounded-2xl overflow-hidden">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              title="拡大"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              title="縮小"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={handleReset}
              className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              title="リセット"
            >
              <UIIcon type="refresh" size={20} className="text-white" />
            </button>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-4 left-4 z-10 glass rounded-lg px-3 py-1.5">
            <span className="text-white text-sm font-medium">{Math.round(zoom * 100)}%</span>
          </div>

          <svg
            ref={svgRef}
            viewBox={getViewBox()}
            className="w-full h-auto cursor-grab active:cursor-grabbing"
            style={{ maxHeight: "70vh" }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 背景 */}
            <rect width="500" height="500" fill="transparent" />
            
            {/* 都道府県 */}
            {prefectures.map((pref) => {
              const pos = PREFECTURE_POSITIONS[pref.code];
              if (!pos) return null;

              const isSelected = selectedCode === pref.code;

              return (
                <g
                  key={pref.code}
                  onClick={() => handlePrefectureClick(pref.code)}
                  className="cursor-pointer transition-all duration-200"
                >
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={pos.width}
                    height={pos.height}
                    rx="4"
                    fill={isSelected ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.15)"}
                    stroke={isSelected ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)"}
                    strokeWidth={isSelected ? "2" : "1"}
                    className="hover:fill-white/30 transition-all"
                  />
                  <text
                    x={pos.x + pos.width / 2}
                    y={pos.y + pos.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight={isSelected ? "bold" : "normal"}
                    className="pointer-events-none"
                  >
                    {pref.name.replace("地方", "").replace("県", "").replace("府", "").replace("都", "")}
                  </text>
                </g>
              );
            })}

            {/* 地域ラベル */}
            <text x="350" y="20" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              北海道
            </text>
            <text x="340" y="135" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              東北
            </text>
            <text x="340" y="225" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              関東
            </text>
            <text x="260" y="215" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              北陸
            </text>
            <text x="280" y="285" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              東海
            </text>
            <text x="230" y="290" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              近畿
            </text>
            <text x="160" y="285" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              中国
            </text>
            <text x="170" y="335" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              四国
            </text>
            <text x="100" y="340" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              九州
            </text>
            <text x="60" y="445" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold">
              沖縄
            </text>
          </svg>
        </div>

        <p className="text-xs text-white/60 text-center mt-4">
          ドラッグで移動 • スクロールで拡大・縮小 • 都道府県をクリックして選択
        </p>
      </div>
    </div>
  );
}
