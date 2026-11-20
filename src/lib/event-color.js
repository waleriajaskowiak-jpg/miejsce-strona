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

export function mix(hex, target, amount) {
  const parts = (value) => [16, 8, 0].map((shift) => (parseInt(value.slice(1), 16) >> shift) & 255);
  const from = parts(hex);
  const to = parts(target);
  const mixed = from.map((value, index) => Math.round(value * (1 - amount) + to[index] * amount));
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

/** Darker shade of the event colour that stays AA on white and on a 10% tint. */
export function eventInk(color) {
  const tint = mix(color, "#FFFFFF", 0.9);
  for (let step = 0; step <= 40; step += 1) {
    const shade = mix(color, "#141210", step / 40);
    if (contrast(shade, "#FFFFFF") >= 4.6 && contrast(shade, tint) >= 4.6) return shade;
  }
  return "#1A1A1A";
}

/** Number colour. Large type can use the event colour when it clears AA-large on white. */
export function eventNum(color) {
  return contrast(color, "#FFFFFF") >= 3 ? color : eventInk(color);
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
