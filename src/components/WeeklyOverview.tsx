import { OverviewForecast } from "../types/weather";

interface WeeklyOverviewProps {
  overview: OverviewForecast;
}

export function WeeklyOverview({ overview }: WeeklyOverviewProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📋</span>
        週間予報解説
      </h2>

      {overview.headlineText && (
        <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-sm font-medium text-amber-800">
            {overview.headlineText}
          </p>
        </div>
      )}

      <div className="prose prose-sm max-w-none">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {overview.text}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          発表元: {overview.publishingOffice}
        </p>
      </div>
    </div>
  );
}
