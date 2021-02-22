import { Styles, convertNumericStylesToPixels } from "./style";

const defaultSpeed = 1200; //pixels per second

export type Options = KeyframeAnimationOptions & {
  speed?: number;
  doNotFadeOut?: boolean;
  initialHeight?: number;
};

export const animateHeight = (
  elem: HTMLElement,
  from: number,
  to: number,
  options?: Options
): Animation => {
  const targetOpacity = from > to ? 0 : 1;
  const sourceOpacity = from <= to ? 0 : 1;
  const start: Styles = {
    height: from,
    opacity: sourceOpacity,
  };
  let end: Styles = {
    height: to,
    opacity: targetOpacity,
  };
  const s = getComputedStyle(elem);
  if (s.paddingTop || s.paddingBottom) {
    end.paddingTop = 0;
    end.paddingBottom = 0;
  }
  if (options?.doNotFadeOut) {
    delete start.opacity;
    delete end.opacity;
  }
  return animate(elem, [start, end], {
    duration: getDuration(from, to, options?.speed || defaultSpeed),
    easing: "ease-out",
    ...options,
  });
};

export const getDuration = (from: number, to: number, speed: number) => {
  const distance = Math.abs(to - from);
  return (distance / speed) * 1000;
};

//this module allows using numbers for properties for animation
//also in case I will be using unit tests with jest, I can mock animations more easily if it is extracted

export const animate = (
  element: HTMLElement,
  //I'm using my plain styles here, even thought Keyframe has three additional properies
  // like CompositeOperationOrAuto, but sinse I'm not using them and do not forsee usage, I won't add them into types
  // future me - please add type union if you are going to use config for each frame
  frames: Styles[] | Styles,
  options: KeyframeAnimationOptions
) => {
  const convertedStyles = Array.isArray(frames)
    ? frames.map(convertNumericStylesToPixels)
    : convertNumericStylesToPixels(frames);
  return element.animate(convertedStyles as any, options);
};
