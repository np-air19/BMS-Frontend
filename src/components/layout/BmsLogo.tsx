interface BmsLogoProps {
  variant?: 'icon' | 'wordmark';
  colorScheme?: 'light' | 'dark';
  size?: number;
  className?: string;
}

export function BmsLogo({
  variant = 'icon',
  colorScheme = 'light',
  size = 32,
  className,
}: BmsLogoProps) {
  if (variant === 'wordmark') {
    const textColor = colorScheme === 'dark' ? '#0f172a' : '#ffffff';
    const subOpacity = colorScheme === 'dark' ? 0.45 : 0.5;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 184 40"
        width={184}
        height={34}
        className={className}
        style={{ display: 'block' }}
        aria-label="BMS — Bookmark Management System"
        role="img"
      >
        <defs>
          <linearGradient id="bms-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>

        {/* Icon block */}
        <rect x="4" y="4" width="32" height="32" rx="7" fill="url(#bms-logo-grad)" />
        <path d="M13 9H27V31L20 26L13 31V9Z" fill="white" />
        <rect x="16" y="15" width="8" height="1.5" rx="0.75" fill="#4338ca" fillOpacity="0.5" />
        <rect x="16" y="18.5" width="5.5" height="1.5" rx="0.75" fill="#4338ca" fillOpacity="0.5" />

        {/* Wordmark */}
        <text
          x="48"
          y="26"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="18"
          fontWeight="700"
          fill={textColor}
          letterSpacing="-0.4"
        >
          BMS
        </text>
        <text
          x="49"
          y="36"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="7.5"
          fontWeight="500"
          fill={textColor}
          fillOpacity={subOpacity}
          letterSpacing="0.8"
        >
          BOOKMARK MANAGEMENT
        </text>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      style={{ display: 'block' }}
      aria-label="BMS"
      role="img"
    >
      <defs>
        <linearGradient id="bms-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#bms-icon-grad)" />
      <path d="M9 5H23V27L16 22L9 27V5Z" fill="white" />
      <rect x="12" y="11" width="8" height="1.5" rx="0.75" fill="#4338ca" fillOpacity="0.5" />
      <rect x="12" y="14.5" width="5.5" height="1.5" rx="0.75" fill="#4338ca" fillOpacity="0.5" />
    </svg>
  );
}
