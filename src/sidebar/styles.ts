import {
  cls,
  css,
  cssClass,
  styles,
  cssClassOnHover,
  cssText,
  colors,
} from "../infra";

export const headerHeight = 56;
export const expandCollapseTransitionTime = 400;
export const focusTransitionTime = 400;
export const fadeOutTime = 400;
//TODO: Fix this constant. change breaks layout (chevron is not properly positioned)
export const rowMarginPerLevel = 16;

const focusTransition = `${focusTransitionTime}ms ease-in-out`;

css(`.${cls.page}.${cls.grabbing}`, {
  cursor: "grabbing",
});

cssClass(cls.noUserSelect, {
  userSelect: "none",
});

cssClass(cls.sidebarFocusContainer, {
  transition: `margin ${focusTransition}`,
  position: "relative",
});

cssText(styles.cssTextForScrollBar(cls.sidebar, { width: 8 }));

cssClass(cls.sidebarRow, {
  height: "27px",
  marginLeft: "2px",
  color: "white",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  cursor: "pointer",
  transition: `opacity ${focusTransition}, 
  height ${expandCollapseTransitionTime}ms ease-out`,
  overflow: "hidden",
  position: "relative",
});

cssClass(cls.sidebarRemoveItemButton, {
  position: "absolute",
  right: "0",
  top: "0",
  bottom: "0",
  width: "30px",
  color: "black",
  opacity: "0",
});

cssClassOnHover(cls.sidebarRemoveItemButton, {
  color: "#f44336",
});

css(`.${cls.sidebarRow}:hover .${cls.sidebarRemoveItemButton}`, {
  opacity: "1",
});

cssClassOnHover(cls.sidebarRow, {
  backgroundColor: "rgba(255,255,255, 0.08)",
});

css(`.${cls.sidebar} .${cls.sidebarRowSelected}`, {
  backgroundColor: colors.selectedRow,
});

css(`.${cls.grabbing} .${cls.sidebarRow}`, {
  cursor: "inherit",
  backgroundColor: "inherit",
});

css(
  [
    `.${cls.sidebar} .${cls.sidebarRowFocused}.${cls.sidebarRow}`,
    `.${cls.sidebar} .${cls.sidebarRowChildrenContainerFocused} .${cls.sidebarRow}`,
  ],
  {
    opacity: "1",
    pointerEvents: "auto",
  }
);

cssClass(cls.sidebarRowText, {
  transition: `font-size ${focusTransition}`,
  whiteSpace: "nowrap",
});

css(`.${cls.sidebarRowFocused} .${cls.sidebarRowText}`, {
  fontSize: "22px",
});

cssClass(cls.sidebarRowChildrenContainer, {
  transition: `height ${expandCollapseTransitionTime}ms ease-out`,
  overflow: "hidden",
});

cssClass(cls.sidebarRowChildrenContainerHighlighted, {
  backgroundColor: "rgba(255,255,255,0.04)",
});

//Row chevron
cssClass(cls.sidebarRowExpandButton, {
  width: "14px",
  height: "14px",
  color: "rgb(184, 184, 184)",
  transition: `transform ${expandCollapseTransitionTime}ms ease-out, 
                 opacity ${expandCollapseTransitionTime}ms ease-out`,
  opacity: "0",
});

css(`.${cls.sidebar}:hover .${cls.sidebarRowExpandButton}`, {
  opacity: "1",
});

cssClass(cls.sidebarRowExpandButtonContainer, {
  padding: "2px",
  color: "gray",
  ...styles.flexCenter,
});
css(
  `.${cls.sidebarRowExpandButtonContainer}:hover > .${cls.sidebarRowExpandButton}`,
  {
    color: "white",
  }
);
css(
  [
    `.${cls.sidebarFocusContainerFocused} .${cls.sidebarRow}`,
    `.${cls.sidebarRowFocused} .${cls.sidebarRowExpandButtonContainer}`,
    `.${cls.sidebarHideChevrons}.${cls.sidebar} .${cls.sidebarRowExpandButton}`,
  ],
  {
    opacity: "0",
    pointerEvents: "none",
  }
);

//Row Circle
cssClass(cls.sidebarRowCircle, {
  minWidth: "6px",
  width: "6px",
  height: "6px",
  borderRadius: "3px",
  backgroundColor: "rgb(184, 184, 184)",
  color: "rgb(184, 184, 184)",
  marginRight: "8px",
  marginLeft: "4px",
  transition: `
  transform 200ms ease-out,
  color 200ms ease-out`,
});

css(`.${cls.sidebarRowFocused} .${cls.sidebarRowCircle}`, {
  backgroundColor: "rgba(0,0,0,0)",
  minWidth: "10px",
  width: "10px",
  height: "20px",
  marginRight: "4px",
});

cssClassOnHover(cls.sidebarRowCircle, {
  transform: "scale(1.6)",
  backgroundColor: "white",
  color: "white",
  animation: "none",
});

css(`.${cls.sidebarRowCircle}:active`, {
  transform: "scale(1.2)",
});

css(`.${cls.sidebarRowFocused} .${cls.sidebarRowCircle}:hover`, {
  color: "white",
  backgroundColor: "rgba(0,0,0,0)",
  transform: "scale(1.5)",
});

cssClass(cls.circlePlaying, {
  animation: "pulsate 0.6s ease-in-out infinite both",
});

cssText(`
@keyframes pulsate {
  0% {
    transform: scale(1) translate3d(0px, 0px, 0px);
  }
  33% {
    transform: scale(1.4, 0.9) translate3d(0px, 3px, 0px);
  }
  66% {
    transform: scale(0.9, 1.1) translate3d(0px, -1px, 0px);
  }
  100% {
    transform: scale(1) translate3d(0px, 0px, 0px);
  }
}`);

//DND
cssClass(cls.dragAvatar, {
  pointerEvents: "none",
  backgroundColor: "rgba(255,255,255,0.08)",
  overflow: "hidden",
});

//Common
cssClass(cls.rotated, {
  ...styles.rotate(90),
});

cssClass(cls.hidden, {
  visibility: "hidden",
  pointerEvents: "none",
});

cssClass(cls.deleted, {
  animation: `fadeOut ${fadeOutTime}ms ease-out forwards`,
});

cssText(`
@keyframes fadeOut {
  0%{
    opacity: 1
  }
  30%{
    background-color: #af4448;
  }
  100%{
    background-color: #af4448;
    margin-left: -80px;
    opacity: 0;
  }
}
`);

cssClass(cls.transparent, {
  opacity: "0",
  pointerEvents: "none",
});
