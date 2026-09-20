import { prefectures, regions } from "../data/prefectures";

interface RegionSelectorProps {
  selectedCode: string;
  onCodeChange: (code: string) => void;
}

export function RegionSelector({ selectedCode, onCodeChange }: RegionSelectorProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📍</span>
        地域を選択
      </h2>

      <div className="space-y-4">
        {regions.map((region) => (
          <div key={region}>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              {region}
            </h3>
            <div className="flex flex-wrap gap-2">
              {prefectures
                .filter((p) => p.region === region)
                .map((pref) => (
                  <button
                    key={pref.code}
                    onClick={() => onCodeChange(pref.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedCode === pref.code
                        ? "bg-blue-500 text-white shadow-md scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                    }`}
                  >
                    {pref.name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
