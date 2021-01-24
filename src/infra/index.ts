export { cls, ids, ClassName, zIndexes } from "./keys";
export { cssClass, css, styles, cssClassOnHover, cssText } from "./style";
export { div, findFirstByClass, findById, fragment } from "./dom";
export * as dom from "./dom";
export * as anim from "./animations";
export * as colors from "./colors";
import * as dom from "./dom";

//@ts-ignore
global.dom = dom;

export const isProd = process.env.NODE_ENV === "production";
