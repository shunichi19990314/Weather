export function getWeatherEmoji(code: string): string {
  if (!code) return "🌤️";
  
  const codeNum = parseInt(code);
  
  if (codeNum >= 100 && codeNum < 200) {
    // 晴れ系
    if (codeNum === 100 || codeNum === 101) return "☀️";
    if (codeNum === 102 || codeNum === 103) return "🌤️";
    if (codeNum === 104 || codeNum === 105 || codeNum === 106 || codeNum === 107) return "🌤️";
    if (codeNum === 108 || codeNum === 109 || codeNum === 110 || codeNum === 111) return "🌤️";
    return "☀️";
  }
  
  if (codeNum >= 200 && codeNum < 300) {
    // 曇り系
    if (codeNum === 200 || codeNum === 201) return "☁️";
    if (codeNum === 202 || codeNum === 203) return "🌥️";
    if (codeNum === 204 || codeNum === 205 || codeNum === 206 || codeNum === 207) return "🌥️";
    if (codeNum === 208 || codeNum === 209 || codeNum === 210 || codeNum === 211) return "🌥️";
    if (codeNum === 212 || codeNum === 213) return "🌥️";
    return "☁️";
  }
  
  if (codeNum >= 300 && codeNum < 400) {
    // 雨系
    if (codeNum === 300 || codeNum === 301) return "🌧️";
    if (codeNum === 302 || codeNum === 303) return "🌧️";
    if (codeNum === 304 || codeNum === 306 || codeNum === 308) return "🌧️";
    if (codeNum === 309 || codeNum === 311 || codeNum === 313) return "🌧️";
    if (codeNum === 314 || codeNum === 315 || codeNum === 316) return "🌧️";
    return "🌧️";
  }
  
  if (codeNum >= 400 && codeNum < 500) {
    // 雪系
    if (codeNum === 400 || codeNum === 401) return "🌨️";
    if (codeNum === 402 || codeNum === 403) return "🌨️";
    if (codeNum === 405 || codeNum === 406 || codeNum === 407) return "🌨️";
    if (codeNum === 409 || codeNum === 410 || codeNum === 411) return "🌨️";
    if (codeNum === 413 || codeNum === 414) return "🌨️";
    return "🌨️";
  }
  
  return "🌤️";
}

export function getWeatherBgClass(code: string): string {
  if (!code) return "from-yellow-100 to-blue-100";
  
  const codeNum = parseInt(code);
  
  if (codeNum >= 100 && codeNum < 200) {
    return "from-yellow-200 to-orange-100";
  }
  
  if (codeNum >= 200 && codeNum < 300) {
    return "from-gray-200 to-gray-100";
  }
  
  if (codeNum >= 300 && codeNum < 400) {
    return "from-blue-200 to-blue-100";
  }
  
  if (codeNum >= 400 && codeNum < 500) {
    return "from-blue-100 to-white";
  }
  
  return "from-yellow-100 to-blue-100";
}

export function getWeatherDescription(code: string): string {
  if (!code) return "不明";
  
  const codeNum = parseInt(code);
  
  if (codeNum >= 100 && codeNum < 200) return "晴れ";
  if (codeNum >= 200 && codeNum < 300) return "曇り";
  if (codeNum >= 300 && codeNum < 400) return "雨";
  if (codeNum >= 400 && codeNum < 500) return "雪";
  
  return "不明";
}
