interface WeatherIconProps {
  code: string;
  size?: number;
  className?: string;
}

export function WeatherIcon({ code, size = 64, className = "" }: WeatherIconProps) {
  const codeNum = parseInt(code);

  // 気象庁コード (100-499)
  // 晴れ
  if (codeNum >= 100 && codeNum < 200) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <circle cx="32" cy="32" r="16" fill="#FFD700" />
        <g stroke="#FFD700" strokeWidth="3" strokeLinecap="round">
          <line x1="32" y1="8" x2="32" y2="4" />
          <line x1="32" y1="60" x2="32" y2="56" />
          <line x1="8" y1="32" x2="4" y2="32" />
          <line x1="60" y1="32" x2="56" y2="32" />
          <line x1="14.4" y1="14.4" x2="11.6" y2="11.6" />
          <line x1="52.4" y1="52.4" x2="49.6" y2="49.6" />
          <line x1="14.4" y1="49.6" x2="11.6" y2="52.4" />
          <line x1="52.4" y1="11.6" x2="49.6" y2="14.4" />
        </g>
      </svg>
    );
  }

  // 曇り
  if (codeNum >= 200 && codeNum < 300) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <ellipse cx="24" cy="36" rx="12" ry="10" fill="#B0BEC5" />
        <ellipse cx="36" cy="32" rx="14" ry="12" fill="#CFD8DC" />
        <ellipse cx="44" cy="36" rx="10" ry="8" fill="#B0BEC5" />
      </svg>
    );
  }

  // 雨
  if (codeNum >= 300 && codeNum < 400) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <ellipse cx="24" cy="28" rx="12" ry="10" fill="#78909C" />
        <ellipse cx="36" cy="24" rx="14" ry="12" fill="#90A4AE" />
        <ellipse cx="44" cy="28" rx="10" ry="8" fill="#78909C" />
        <g fill="#4FC3F7">
          <ellipse cx="20" cy="44" rx="2" ry="4" />
          <ellipse cx="32" cy="48" rx="2" ry="4" />
          <ellipse cx="44" cy="44" rx="2" ry="4" />
        </g>
      </svg>
    );
  }

  // 雪
  if (codeNum >= 400 && codeNum < 500) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <ellipse cx="24" cy="28" rx="12" ry="10" fill="#B0BEC5" />
        <ellipse cx="36" cy="24" rx="14" ry="12" fill="#CFD8DC" />
        <ellipse cx="44" cy="28" rx="10" ry="8" fill="#B0BEC5" />
        <g fill="#FFFFFF" stroke="#90CAF9" strokeWidth="0.5">
          <circle cx="20" cy="44" r="3" />
          <circle cx="32" cy="48" r="3" />
          <circle cx="44" cy="44" r="3" />
        </g>
      </svg>
    );
  }

  // WMO weather code (Open-Meteo API)
  // 快晴・晴れ
  if (codeNum === 0 || codeNum === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <circle cx="32" cy="32" r="16" fill="#FFD700" />
        <g stroke="#FFD700" strokeWidth="3" strokeLinecap="round">
          <line x1="32" y1="8" x2="32" y2="4" />
          <line x1="32" y1="60" x2="32" y2="56" />
          <line x1="8" y1="32" x2="4" y2="32" />
          <line x1="60" y1="32" x2="56" y2="32" />
          <line x1="14.4" y1="14.4" x2="11.6" y2="11.6" />
          <line x1="52.4" y1="52.4" x2="49.6" y2="49.6" />
          <line x1="14.4" y1="49.6" x2="11.6" y2="52.4" />
          <line x1="52.4" y1="11.6" x2="49.6" y2="14.4" />
        </g>
      </svg>
    );
  }

  // 一部曇り・曇り
  if (codeNum === 2 || codeNum === 3) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <ellipse cx="24" cy="36" rx="12" ry="10" fill="#B0BEC5" />
        <ellipse cx="36" cy="32" rx="14" ry="12" fill="#CFD8DC" />
        <ellipse cx="44" cy="36" rx="10" ry="8" fill="#B0BEC5" />
      </svg>
    );
  }

  // 霧
  if (codeNum === 45 || codeNum === 48) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <g stroke="#B0BEC5" strokeWidth="3" strokeLinecap="round" opacity="0.7">
          <line x1="8" y1="24" x2="56" y2="24" />
          <line x1="8" y1="32" x2="56" y2="32" />
          <line x1="8" y1="40" x2="56" y2="40" />
        </g>
      </svg>
    );
  }

  // 霧雨・雨
  if ((codeNum >= 51 && codeNum <= 57) || (codeNum >= 61 && codeNum <= 67) || (codeNum >= 80 && codeNum <= 82)) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <ellipse cx="24" cy="28" rx="12" ry="10" fill="#78909C" />
        <ellipse cx="36" cy="24" rx="14" ry="12" fill="#90A4AE" />
        <ellipse cx="44" cy="28" rx="10" ry="8" fill="#78909C" />
        <g fill="#4FC3F7">
          <ellipse cx="20" cy="44" rx="2" ry="4" />
          <ellipse cx="32" cy="48" rx="2" ry="4" />
          <ellipse cx="44" cy="44" rx="2" ry="4" />
        </g>
      </svg>
    );
  }

  // 雪・にわか雪
  if ((codeNum >= 71 && codeNum <= 77) || (codeNum >= 85 && codeNum <= 86)) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <ellipse cx="24" cy="28" rx="12" ry="10" fill="#B0BEC5" />
        <ellipse cx="36" cy="24" rx="14" ry="12" fill="#CFD8DC" />
        <ellipse cx="44" cy="28" rx="10" ry="8" fill="#B0BEC5" />
        <g fill="#FFFFFF" stroke="#90CAF9" strokeWidth="0.5">
          <circle cx="20" cy="44" r="3" />
          <circle cx="32" cy="48" r="3" />
          <circle cx="44" cy="44" r="3" />
        </g>
      </svg>
    );
  }

  // 雷雨
  if (codeNum >= 95 && codeNum <= 99) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <ellipse cx="24" cy="28" rx="12" ry="10" fill="#78909C" />
        <ellipse cx="36" cy="24" rx="14" ry="12" fill="#90A4AE" />
        <ellipse cx="44" cy="28" rx="10" ry="8" fill="#78909C" />
        <path d="M30 40 L26 50 L32 50 L28 60" stroke="#FFD700" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  // デフォルト（晴れ）
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="16" fill="#FFD700" />
      <g stroke="#FFD700" strokeWidth="3" strokeLinecap="round">
        <line x1="32" y1="8" x2="32" y2="4" />
        <line x1="32" y1="60" x2="32" y2="56" />
        <line x1="8" y1="32" x2="4" y2="32" />
        <line x1="60" y1="32" x2="56" y2="32" />
        <line x1="14.4" y1="14.4" x2="11.6" y2="11.6" />
        <line x1="52.4" y1="52.4" x2="49.6" y2="49.6" />
        <line x1="14.4" y1="49.6" x2="11.6" y2="52.4" />
        <line x1="52.4" y1="11.6" x2="49.6" y2="14.4" />
      </g>
    </svg>
  );
}
