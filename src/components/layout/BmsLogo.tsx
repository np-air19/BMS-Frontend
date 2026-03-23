interface BmsLogoProps {
  variant?: 'icon' | 'wordmark';
  /** 'light' = white text (for dark sidebar), 'dark' = dark text (for light bg like signin) */
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
    const src =
      colorScheme === 'dark' ? '/bms-wordmark-dark.svg' : '/bms-wordmark-light.svg';
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        height={34}
        alt="BMS — Bookmark Management System"
        className={className}
        style={{ display: 'block', width: 'auto' }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/bms-icon.svg"
      width={size}
      height={size}
      alt="BMS"
      className={className}
      style={{ display: 'block' }}
    />
  );
}
