export { cls, ids, ClassName, zIndexes } from "./keys";
export { cssClass, css, styles, cssClassOnHover, cssText } from "./style";
export {
  div,
  findFirstByClass,
  findById,
  fragment,
  DivDefinition,
  EventsDefinition,
} from "./dom";
export * as dom from "./dom";
export * as anim from "./animations";
export * as colors from "./colors";
import * as dom from "./dom";
import * as anim from "./animations";

//@ts-ignore
global.dom = dom;

//@ts-ignore
global.anim = anim;

declare const ISOLATED: boolean;

export const isProd = process.env.NODE_ENV === "production";
export const isIsolated = ISOLATED;
