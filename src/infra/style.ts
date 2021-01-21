import { colors } from ".";
import { ClassName } from "./keys";

const s = document.createElement("style");
document.head.appendChild(s);

export const cssClass = (
  clas: ClassName,
  styles: Partial<CSSStyleDeclaration>
) => {
  const text = cssToString("." + clas, styles);
  s.innerHTML += text;
  return text;
};
export const css = (
  selector: string | string[],
  styles: Partial<CSSStyleDeclaration>
) => {
  const res = Array.isArray(selector) ? selector.join(", ") : selector;
  const text = cssToString(res, styles);
  s.innerHTML += text;
  return text;
};
const cssToString = (selector: string, props: Partial<CSSStyleDeclaration>) => {
  const div = document.createElement("div");
  Object.assign(div.style, props);
  return formatStyle(selector, div.style.cssText);
};

export const cssText = (text: string) => {
  s.innerHTML += text;
};

const formatStyle = (selector: string, body: string) =>
  `${selector}{
  ${body}
}
`;

export const styles = {
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
  },
  absoluteTopRight: (top: number, right: number) => ({
    position: "absolute",
    top: top + "px",
    right: right + "px",
  }),
  absoluteTopLeft: (top: number, left: number) => ({
    position: "absolute",
    top: top + "px",
    left: left + "px",
  }),
  rotate: (deg: number) => ({
    transform: `rotateZ(${deg}deg)`,
  }),

  cssTextForScrollBar: (
    className: ClassName,
    { width, height }: { width?: number; height?: number }
  ) =>
    `
  .${className}::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  
  .${className}::-webkit-scrollbar-thumb {
    background-color: ${colors.scrollBar};
  }
  
  .${className}:hover::-webkit-scrollbar {
    ${width ? "width: " + width + "px" : ""}
    ${height ? "height: " + height + "px" : ""}
  }`,
};
