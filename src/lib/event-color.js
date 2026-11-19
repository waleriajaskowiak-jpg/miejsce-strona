function channel(value) {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function contrast(hexA, hexB) {
  const lum = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
  };
  const a = lum(hexA);
  const b = lum(hexB);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Ground under an event-coloured number. Picks the neutral with the higher contrast. */
export function statSurface(color) {
  const onInk = contrast(color, "#2B2B2B");
  const onWhite = contrast(color, "#FFFFFF");
  return onWhite >= onInk && onWhite >= 3 ? "paper" : "ink";
}

export function toneIsLight(color) {
  return contrast(color, "#FFFFFF") < 3;
}
