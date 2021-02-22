export { cls, ids, ClassName, zIndexes } from "./keys";
export {
  cssClass,
  css,
  styles,
  cssClassOnHover,
  cssClassOnActive,
  cssText,
} from "./style";
export {
  div,
  findFirstByClass,
  findById,
  fragment,
  DivDefinition,
  EventsDefinition,
} from "./dom";
export * as dom from "./dom";
export * as icons from "./icons";
export * as anim from "./animations";
export * as colors from "./colors";
export * as utils from "./utils";
export * as itemEvents from "./events";
import * as dom from "./dom";
import * as anim from "./animations";
import {
  cssClass,
  css as selector,
  cssClassOnHover,
  cssClassOnActive,
  cssText,
  Styles,
} from "./style";
export const s = {
  id: (id: string, style: Styles) => selector("#" + id, style),
  selector,
  class: cssClass,
  active: cssClassOnActive,
  hover: cssClassOnHover,
  text: cssText,
};

declare const ISOLATED: boolean;

export const isProd = process.env.NODE_ENV === "production";
export const isIsolated = ISOLATED;

if (isIsolated) {
  //@ts-ignore
  global.dom = dom;

  //@ts-ignore
  global.anim = anim;
}
