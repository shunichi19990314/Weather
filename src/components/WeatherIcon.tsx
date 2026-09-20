interface WeatherIconProps {
  code: string;
  size?: number;
  className?: string;
}

export function WeatherIcon({ code, size = 64, className = "" }: WeatherIconProps) {
  const codeNum = parseInt(code);

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
