import React from 'react';

export default function Icon({ glyph, width, height, className = 'icon', style }) {
  if (glyph) {
    return (
      <svg viewBox={glyph.viewBox} className={className} width={width} height={height} style={style}>
        <use xlinkHref={`#${glyph.id}`} />
      </svg>
    );
  }
  return null;
}
