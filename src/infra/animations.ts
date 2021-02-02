import { dom } from ".";
import { DivDefinition } from "./dom";

export const collapseElementHeight = (
  node: HTMLElement,
  time: number,
  removeNodeAfter = false
) => {
  node.style.height = node.offsetHeight + "px";
  clearPendingTimeouts(node);

  setTimeout(() => {
    node.style.height = "0px";
    var timeout = setTimeout(() => {
      if (removeNodeAfter) {
        node.remove();
      } else {
        node.innerHTML = "";
        node.removeAttribute("data-timeout");
      }
    }, time);
    node.setAttribute("data-timeout", timeout + "");

    //this 20 for setTimeout let's browser to apply height and then transition to a new height
    // kind of buggy, but if I set 0 no CSS animation happends
    // tried to use requestAnimationFrame without any success
    // need to think on this, maybe use WebAnimations API
  }, 20);
};

export const openElementHeight = (
  node: HTMLElement,
  children: string | DivDefinition | DivDefinition[],
  time: number,
  getTargetHeightAfterAppend?: () => number
) => {
  node.style.height = "0px";
  var hasClearedTimeout = clearPendingTimeouts(node);
  if (!hasClearedTimeout) {
    if (typeof children == "string") node.append(children);
    else if (Array.isArray(children)) node.appendChild(dom.fragment(children));
    else node.append(dom.div(children));
  }
  setTimeout(() => {
    node.style.height = getTargetHeightAfterAppend
      ? getTargetHeightAfterAppend() + "px"
      : node.scrollHeight + "px";
    var timeout = setTimeout(() => {
      node.style.removeProperty("height");
      node.removeAttribute("data-timeout");
    }, time);
    node.setAttribute("data-timeout", timeout + "");
  }, 20);
};

export const expandElementHeight = (
  node: HTMLElement,
  time: number,
  targetHeight: number,
  onDone: () => void
) => {
  node.style.transition = "height 0ms ease-in";
  node.style.height = "0px";
  clearPendingTimeouts(node);
  setTimeout(() => {
    node.style.removeProperty("transition");
    node.style.height = targetHeight + "px";
    var timeout = setTimeout(() => {
      node.style.removeProperty("height");
      node.removeAttribute("data-timeout");
      onDone();
    }, time);
    node.setAttribute("data-timeout", timeout + "");
  }, 20);
};

const clearPendingTimeouts = (node: HTMLElement): boolean => {
  const timeout = node.dataset.timeout;
  if (timeout) {
    clearTimeout(parseInt(timeout));
    node.removeAttribute("data-timeout");
  }
  return !!timeout;
};
