const defaultSpeed = 1200; //pixels per second

export type Options = KeyframeAnimationOptions & {
  speed?: number;
  doNotFadeOut?: boolean;
};

export const animateHeight = (
  elem: HTMLElement,
  from: number,
  to: number,
  options?: Options
): Animation => {
  const targetOpacity = from > to ? 0 : 1;
  const sourceOpacity = from <= to ? 0 : 1;

  const start: Keyframe = {
    height: from + "px",
    opacity: sourceOpacity,
  };
  const end: Keyframe = {
    height: to + "px",
    opacity: targetOpacity,
  };
  if (options?.doNotFadeOut) {
    delete start.opacity;
    delete end.opacity;
  }
  return elem.animate([start, end], {
    duration: getDuration(from, to, options?.speed || defaultSpeed),
    easing: "ease-out",
    ...options,
  });
};

export const getDuration = (from: number, to: number, speed: number) => {
  const distance = Math.abs(to - from);
  return (distance / speed) * 1000;
};
