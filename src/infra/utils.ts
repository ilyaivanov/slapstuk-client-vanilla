//[0 .. to] inclusive
export const generateNumbers = (to: number) =>
  Array.from(new Array(to)).map((_, index) => index);

export function hexToRGB(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

export const max = (vals: number[]): number | undefined => {
  if (vals.length > 0) {
    let max = vals[0];
    for (var i = 0; i < vals.length; i++) {
      if (max < vals[i]) max = vals[i];
    }
    return max;
  }
  return undefined;
};
