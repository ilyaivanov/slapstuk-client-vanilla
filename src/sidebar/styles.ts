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
export const sidebarCollapseTime = 200;
//TODO: Fix this constant. change breaks layout (chevron is not properly positioned)
export const rowMarginPerLevel = 16;
const focusTransition = `${focusTransitionTime}ms ease-in-out`;
export const sidebarHeaderHeight = 20;

css(`.${cls.page}.${cls.grabbing}`, {
  cursor: "grabbing",
});

cssClass(cls.noUserSelect, {
  userSelect: "none",
});

cssClass(cls.sidebarFocusContainer, {
  transition: `margin ${focusTransition}`,
  paddingTop: sidebarHeaderHeight,
  //this relative positioning is used to properly set negative margins relative to row positions
  position: "relative",
});

cssText(styles.cssTextForScrollBar(cls.sidebarScroll, { width: 8 }));

cssClass(cls.sidebarRow, {
  height: "27px",
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

cssClass(cls.sidebarIconsContainer, {
  ...styles.flexCenter,
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  background: `linear-gradient(to right, transparent 0%, ${colors.sidebarRowHover} 15%)`,
  opacity: 0,
  transform: "translate3d(10px, 0, 0)",
  paddingLeft: 10,
  transition: "opacity 0ms linear, transform 0ms linear",
});

css(`.${cls.sidebarRow}:hover .${cls.sidebarIconsContainer}`, {
  transition: "opacity 200ms ease-in 200ms, transform 200ms ease-in 200ms",
  transform: "translate3d(0, 0, 0)",
  opacity: "1",
});

cssClass(cls.sidebarIcon, {
  color: colors.iconRegular,
  width: 20,
  height: 18,
  paddingRight: 5,
});

cssClassOnHover(cls.sidebarIcon, {
  color: colors.iconHover,
});

cssClass(cls.sidebarIconDelete, {
  marginTop: 2,
});

cssClassOnHover(cls.sidebarIconDelete, {
  color: colors.danger,
});

cssClassOnHover(cls.sidebarRow, {
  backgroundColor: colors.sidebarRowHover,
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

cssClass(cls.sidebarRowInputField, {
  width: `calc(100% - 10px)`,
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
  color: colors.iconRegular,
  transition: `transform ${expandCollapseTransitionTime}ms ease-out, 
                 opacity ${expandCollapseTransitionTime}ms ease-out`,
  opacity: "0",
});

css(`.${cls.sidebar}:hover .${cls.sidebarRowExpandButton}`, {
  opacity: "1",
});

cssClass(cls.sidebarRowExpandButtonContainer, {
  padding: 2,
  paddingLeft: 6,
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
    transform: translate3d(-80px, 0, 0);
    opacity: 0;
  }
}
`);

cssClass(cls.transparent, {
  opacity: "0",
  pointerEvents: "none",
});

//sidebar header
cssClass(cls.sidebarHeader, {
  backgroundColor: colors.menu,
  height: 20,
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  right: 1,
});

//this tricky css is used to preserve background color on sidebarHeader
//such that it will hide parent items of currently focused items
css(`.${cls.sidebarHeader} > *`, {
  transition: "opacity 200ms ease-out",
  opacity: 0,
});

css(`.${cls.sidebar}:hover .${cls.sidebarHeader} > *`, {
  opacity: 1,
});

cssClass(cls.sidebarHeaderIcon, {
  height: sidebarHeaderHeight - 4,
  padding: "0 6px",
  color: colors.iconRegular,
});

cssClassOnHover(cls.sidebarHeaderIcon, {
  color: "white",
  cursor: "pointer",
});

cssClass(cls.sidebarWidthAdjuster, {
  position: "absolute",
  top: 0,
  right: -1,
  width: 2,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  cursor: "col-resize",
});

cssClassOnHover(cls.sidebarWidthAdjuster, {
  backgroundColor: colors.primary,
});

css(`.${cls.sidebarHidden} .${cls.sidebarWidthAdjuster}`, {
  display: "none",
});
