export { cls, ids, ClassName } from "./keys";
export { cssClass, css, styles, cssText } from "./style";
export { div, findFirstByClass, findById, fragment } from "./dom";
export * as dom from "./dom";
import * as dom from "./dom";

//@ts-ignore
global.dom = dom;
