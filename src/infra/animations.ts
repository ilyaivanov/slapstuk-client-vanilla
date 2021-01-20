import { dom } from ".";
import { DivDefinition } from "./dom";

export const collapseElementHeight = (node: HTMLElement, time: number) => {
  node.style.height = node.scrollHeight + "px";
  clearPendingTimeouts(node);
  //this setTimeout let's browser to apply height and then transition to a new height
  setTimeout(() => {
    node.style.height = "0px";
    var timeout = setTimeout(() => {
      node.innerHTML = "";
      node.removeAttribute("data-timeout");
    }, time);
    node.setAttribute("data-timeout", timeout + "");
  });
};

export const openElementHeight = (
  node: HTMLElement,
  children: string | DivDefinition | DivDefinition[],
  time: number
) => {
  node.style.height = "0px";
  var hasClearedTimeout = clearPendingTimeouts(node);
  if (!hasClearedTimeout) {
    if (typeof children == "string") node.append(children);
    else if (Array.isArray(children)) node.appendChild(dom.fragment(children));
    else node.append(dom.div(children));
  }
  setTimeout(() => {
    node.style.height = node.scrollHeight + "px";
    var timeout = setTimeout(() => {
      node.style.removeProperty("height");
      node.removeAttribute("data-timeout");
    }, time);
    node.setAttribute("data-timeout", timeout + "");
  });
};

const clearPendingTimeouts = (node: HTMLElement): boolean => {
  const timeout = node.dataset.timeout;
  if (timeout) {
    clearTimeout(parseInt(timeout));
    node.removeAttribute("data-timeout");
  }
  return !!timeout;
};
