import { Vector3 } from 'three';

export function hexToRgb(hex: string) {
  const x = hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b
    )
    ?.substring(1)
    ?.match(/.{2}/g)
    ?.map((x) => parseInt(x, 16) / 255);
  if (x) {
    return new Vector3(...x);
  } else {
    return new Vector3();
  }

  // return new Float32Array([r, g, b]);
}
export function rgbToHex(r: number, g: number, b: number) {
  function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
