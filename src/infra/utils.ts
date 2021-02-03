//[0 .. to] inclusive
export const generateNumbers = (to: number) =>
  Array.from(new Array(to)).map((_, index) => index);
