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
};
