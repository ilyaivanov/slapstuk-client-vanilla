import { cls, dom, anim } from "../infra";
import * as style from "./styles";

export const collapseRowAndChildContainer = (
  row: HTMLElement,
  childContainer: HTMLElement,
  options?: anim.Options
) => {
  anim.animateHeight(row, row.clientHeight, 0, {
    duration: 60,
    fill: "forwards",
    ...options,
  });
  return anim.animateHeight(childContainer, childContainer.scrollHeight, 0, {
    duration: style.expandCollapseTransitionTime,
    fill: "forwards",
    ...options,
  });
};

export const expandRowAndChildContainer = (
  row: HTMLElement,
  childContainer: HTMLElement
) => {
  anim
    .animateHeight(row, 0, row.clientHeight, {
      duration: 60,
    })
    .addEventListener("finish", removeClassHidingChevrons);
  expandChildContainer(childContainer, {
    delay: 40,
    fill: "backwards",
  });
};

export const expandChildContainer = (
  childContainer: HTMLElement,
  options?: anim.Options
) =>
  anim.animateHeight(
    childContainer,
    options?.initialHeight || 0,
    childContainer.scrollHeight,
    {
      duration: style.expandCollapseTransitionTime,
      ...options,
    }
  );

export const collapseChildContainer = (
  childContainer: HTMLElement,
  options?: anim.Options
) =>
  anim.animateHeight(childContainer, childContainer.scrollHeight, 0, {
    duration: style.expandCollapseTransitionTime,
    ...options,
  });

//not part of animations, but easier to add it here
export const removeClassHidingChevrons = () => {
  dom.removeClassFromElement(cls.sidebar, cls.sidebarHideChevrons);
};
