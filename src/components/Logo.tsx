interface LogoProps {
  className?: string;
  compact?: boolean;
  light?: boolean;
}

export function Logo({ className = '', compact = false, light = false }: LogoProps) {
  const textColor = light ? '#FFFFFF' : '#5A5450';
  const starColor = light ? '#AAAAAA' : '#7A7068';
  const dividerColor = light ? '#555555' : '#C8C0B8';

  if (compact) {
    return (
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Abundant Merchandise"
      >
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i * 360) / 14 - 90;
          const rad = (angle * Math.PI) / 180;
          const r = 36;
          const cx = 40 + r * Math.cos(rad);
          const cy = 40 + r * Math.sin(rad);
          return <circle key={i} cx={cx} cy={cy} r={2.2} fill={starColor} />;
        })}
        {/* Orange swoosh/wing */}
        <path d="M22 53 L33 25 L39 39 L28 51 Z" fill="#E8621A" />
        <path d="M33 25 L45 43 L39 39 Z" fill="#E8621A" opacity={0.7} />
        {/* Dark arrow/chevron */}
        <path d="M37 45 L46 27 L55 45 L49 41 Z" fill={light ? '#CCCCCC' : '#4A4642'} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 330 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Abundant Merchandise"
    >
      {/* Star ring — 14 dots arranged in a circle centered at (40, 40) */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i * 360) / 14 - 90;
        const rad = (angle * Math.PI) / 180;
        const r = 33;
        const cx = 40 + r * Math.cos(rad);
        const cy = 40 + r * Math.sin(rad);
        return <circle key={i} cx={cx} cy={cy} r={2.1} fill={starColor} />;
      })}

      {/* Orange swoosh / left wing */}
      <path d="M21 54 L33 24 L40 39 L28 52 Z" fill="#E8621A" />
      <path d="M33 24 L46 43 L40 39 Z" fill="#E8621A" opacity={0.68} />

      {/* Charcoal arrow / right chevron */}
      <path d="M38 46 L47 26 L56 46 L50 42 Z" fill={light ? '#BBBBBB' : '#4A4642'} />

      {/* Vertical divider */}
      <line x1="77" y1="15" x2="77" y2="65" stroke={dividerColor} strokeWidth="1.4" />

      {/* "Abundant" — grey / white depending on variant */}
      <text
        x="92"
        y="47"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        fontSize="28"
        fill={textColor}
        letterSpacing="-0.4"
      >
        Abundant
      </text>

      {/* "MERCHANDISE" — always brand orange */}
      <text
        x="93"
        y="63"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="500"
        fontSize="11"
        fill="#E8621A"
        letterSpacing="3.8"
      >
        MERCHANDISE
      </text>
    </svg>
  );
}
