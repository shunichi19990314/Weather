import { prefectures, regions } from "../data/prefectures";
import { UIIcon } from "./UIIcon";

interface RegionSelectorProps {
  selectedCode: string;
  onCodeChange: (code: string) => void;
}

export function RegionSelector({ selectedCode, onCodeChange }: RegionSelectorProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <UIIcon type="search" size={20} className="text-white" />
        地域を選択
      </h2>

      <div className="space-y-5">
        {regions.map((region) => (
          <div key={region}>
            <h3 className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
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
                        ? "bg-white text-gray-800 shadow-lg scale-105"
                        : "bg-white/10 text-white hover:bg-white/20"
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
