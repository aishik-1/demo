import React from 'react';

interface BStackLogoProps {
  className?: string;
  size?: number;
}

/**
 * B/Stack Official Insignia (from reference photo):
 * Precision geometric tripartite delta glyph with 3-fold (120°) rotational symmetry.
 * Three identical rounded chevron/parallelogram blades cycling counter-clockwise
 * around an inverted central equilateral triangular aperture.
 */
export const BStackLogo: React.FC<BStackLogoProps> = ({
  className = 'w-6 h-6 text-white',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="B/Stack Logo"
    >
      <g fill="currentColor">
        {/* Blade 1 (Top blade: horizontal top edge with rounded corners, slanted inner & return edges) */}
        <path d="M 24 27 C 21.8 27 20.8 28.8 21.8 30.5 L 29.5 41.5 C 30.5 42.8 32 43.5 33.8 43.5 L 64.5 43.5 C 66.5 43.5 67.5 41.8 66.5 40.2 L 59.8 29.2 C 58.8 27.8 57.2 27 55.5 27 Z" />

        {/* Blade 2 (Right blade: rotated 120° around center (50, 50)) */}
        <path
          d="M 24 27 C 21.8 27 20.8 28.8 21.8 30.5 L 29.5 41.5 C 30.5 42.8 32 43.5 33.8 43.5 L 64.5 43.5 C 66.5 43.5 67.5 41.8 66.5 40.2 L 59.8 29.2 C 58.8 27.8 57.2 27 55.5 27 Z"
          transform="rotate(120, 50, 50)"
        />

        {/* Blade 3 (Bottom-left blade: rotated 240° around center (50, 50)) */}
        <path
          d="M 24 27 C 21.8 27 20.8 28.8 21.8 30.5 L 29.5 41.5 C 30.5 42.8 32 43.5 33.8 43.5 L 64.5 43.5 C 66.5 43.5 67.5 41.8 66.5 40.2 L 59.8 29.2 C 58.8 27.8 57.2 27 55.5 27 Z"
          transform="rotate(240, 50, 50)"
        />
      </g>
    </svg>
  );
};
