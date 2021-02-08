import { ClassName } from "./keys";
import { Styles, convertNumericStylesToPixels } from "./style";

export type EventsDefinition = {
  [key in string]: (e: MouseEvent) => void;
};

export type DivDefinition = {
  id?: string;
  className?: ClassName | (ClassName | undefined)[];
  children?: DivDefinition | DivDefinition[] | string;
  style?: Styles;

  attributes?: any;
  on?: EventsDefinition;

  type?: "button" | "div" | "svg" | "path" | "img" | "span" | "input";
  onClick?: (e: Event) => void;
};

export const div = (divDefinition: DivDefinition): HTMLElement => {
  const type = divDefinition.type || "div";
  var elem: HTMLElement;
  if (type == "svg" || type == "path")
    elem = (document.createElementNS(
      "http://www.w3.org/2000/svg",
      type
    ) as unknown) as HTMLElement;
  else elem = document.createElement(type);

  const { className } = divDefinition;
  if (className) {
    if (typeof className == "string") {
      elem.classList.add(className);
    } else {
      className.forEach((clas) => {
        if (!!clas) elem.classList.add(clas);
      });
    }
  }

  const { children } = divDefinition;
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        elem.appendChild(div(child));
      });
    } else if (typeof children == "string") {
      elem.textContent = children;
    } else {
      elem.appendChild(div(children));
    }
  }

  if (divDefinition.id) elem.id = divDefinition.id;
  if (divDefinition.style)
    Object.assign(
      elem.style,
      convertNumericStylesToPixels(divDefinition.style)
    );
  if (divDefinition.onClick)
    elem.addEventListener("click", divDefinition.onClick);

  const { attributes } = divDefinition;
  if (attributes) {
    Object.keys(attributes).map((key) => {
      if (!!attributes[key]) elem.setAttribute(key, attributes[key] + "");
    });
  }

  const { on } = divDefinition;
  if (on) {
    Object.keys(on).map((key) => {
      if (!!on[key]) elem.addEventListener(key, on[key] as any);
    });
  }

  return elem as HTMLElement;
};

export const fragment = (nodes: DivDefinition[]) => {
  const fragment = document.createDocumentFragment();
  nodes.forEach((node) => fragment.appendChild(div(node)));
  return fragment;
};

export const findFirstByClass = <T extends HTMLElement>(
  className: ClassName,
  container: HTMLElement = document.body
): T => {
  const elem = container.getElementsByClassName(className);
  if (elem.length === 0) {
    if (process.env.NODE_ENV == "test") {
      console.log(container.outerHTML);
    }
    throw new Error(`Couldn't find any element with a class ${className}`);
  }
  return elem.item(0) as T;
};

export const maybeFindFirstByClass = (
  className: ClassName,
  container: HTMLElement = document.body
): HTMLElement | null => {
  const elem = container.getElementsByClassName(className);
  return elem.item(0) as HTMLElement;
};

export const findAllByClass = (
  className: ClassName,
  container: HTMLElement = document.body
): HTMLElement[] => {
  const elem = container.getElementsByClassName(className);
  if (elem.length === 0) {
    if (process.env.NODE_ENV == "test") {
      console.log(container.outerHTML);
    }
    throw new Error(`Couldn't find any element with a class ${className}`);
  }
  return Array.from(elem) as HTMLElement[];
};

export const findById = (id: string): HTMLElement => {
  const elem = document.getElementById(id);
  if (!elem) throw new Error(`Couldn't find any element with a id ${id}`);
  return elem;
};

export const maybefindById = (id: string): HTMLElement | null => {
  return document.getElementById(id);
};

export const query = (selector: string): Element => {
  const elem = document.querySelector(selector);
  if (!elem)
    throw new Error(`Couldn't find any element with a selector ${selector}`);
  return elem;
};

export const isEmpty = (node: HTMLElement) => node.childNodes.length === 0;

//removes elementClass if classToRemove is not set
export const removeClassFromElement = (
  elementClass: ClassName,
  classToRemove?: ClassName
): Element | null => {
  const element = maybeFindFirstByClass(elementClass);
  if (element) {
    const clsToRemove = classToRemove || elementClass;
    element.classList.remove(clsToRemove);
  }
  return element;
};

export const addClassToElement = (
  elementClass: ClassName,
  classToAdd: ClassName
): Element | null => {
  const element = maybeFindFirstByClass(elementClass);
  if (element) {
    element.classList.add(classToAdd);
  }
  return element;
};

export const addClassToElementById = (id: string, classToAdd: ClassName) => {
  const elem = maybefindById(id);
  if (elem) elem.classList.add(classToAdd);
};

export const removeClassFromElementById = (
  id: string,
  classToRemove: ClassName
) => {
  const elem = maybefindById(id);
  if (elem) elem.classList.remove(classToRemove);
};
export const root = findById("root");

export const set = (
  node: HTMLElement,
  children: DivDefinition | DivDefinition[] | HTMLElement
) => {
  node.innerHTML = ``;
  if (isHtmlElement(children)) node.appendChild(children);
  else if (Array.isArray(children)) node.appendChild(fragment(children));
  else node.appendChild(div(children));
};

export const append = (
  node: HTMLElement,
  children: DivDefinition | DivDefinition[] | HTMLElement
): HTMLElement => {
  if (isHtmlElement(children)) return node.appendChild(children);
  else if (Array.isArray(children))
    //TODO: check this strange convertion
    return (node.appendChild(fragment(children)) as unknown) as HTMLElement;
  else return node.appendChild(div(children));
};

const isHtmlElement = (item: any): item is HTMLElement =>
  item && typeof item.animate == "function";
