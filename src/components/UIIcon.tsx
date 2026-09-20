interface UIIconProps {
  type: "rain" | "wind" | "wave" | "location" | "search" | "refresh" | "star";
  size?: number;
  className?: string;
}

export function UIIcon({ type, size = 20, className = "" }: UIIconProps) {
  switch (type) {
    case "rain":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2C12 2 8 8 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 8 12 2 12 2Z"
            fill="currentColor"
          />
          <path
            d="M6 18C6 18 4 21 4 22C4 22.5523 4.44772 23 5 23C5.55228 23 6 22.5523 6 22C6 21 6 18 6 18Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M18 18C18 18 16 21 16 22C16 22.5523 16.4477 23 17 23C17.5523 23 18 22.5523 18 22C18 21 18 18 18 18Z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
      );

    case "wind":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M3 8H15C16.1046 8 17 7.10457 17 6C17 4.89543 16.1046 4 15 4C13.8954 4 13 4.89543 13 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M3 12H19C20.1046 12 21 12.8954 21 14C21 15.1046 20.1046 16 19 16C17.8954 16 17 15.1046 17 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M3 16H11C12.1046 16 13 16.8954 13 18C13 19.1046 12.1046 20 11 20C9.89543 20 9 19.1046 9 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "wave":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M2 12C2 12 4 8 7 8C10 8 10 12 13 12C16 12 16 8 19 8C22 8 22 12 22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M2 16C2 16 4 12 7 12C10 12 10 16 13 16C16 16 16 12 19 12C22 12 22 16 22 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      );

    case "location":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
            fill="currentColor"
          />
        </svg>
      );

    case "search":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.7 18 14.2607 17.3913 15.4119 16.3919L15.5 16.3164L19.2929 20.1094C19.6834 20.4999 20.3166 20.4999 20.7071 20.1094C21.0976 19.7188 21.0976 19.0856 20.7071 18.6951L16.9141 14.9021L17 14.7929C17.7863 13.7051 18.25 12.4068 18.25 11C18.25 7.13401 14.866 4 11 4ZM11 6C13.7614 6 16 8.23858 16 11C16 13.7614 13.7614 16 11 16C8.23858 16 6 13.7614 6 11C6 8.23858 8.23858 6 11 6Z"
            fill="currentColor"
          />
        </svg>
      );

    case "refresh":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M4 12C4 7.58172 7.58172 4 12 4C14.7614 4 17.1929 5.46835 18.5 7.66667M20 12C20 16.4183 16.4183 20 12 20C9.23858 20 6.80711 18.5317 5.5 16.3333"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 4V8H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 20V16H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      );

    default:
      return null;
  }
}
