import { cls, css, cssClass, styles, cssText } from "../infra";

export const headerHeight = 56;
export const expandCollapseTransitionTime = 200;

//STYLES (goes into view)
cssClass(cls.page, {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gridTemplateRows: "auto 1fr",
  gridTemplateAreas: `
    "header header"
    "sidebar gallery"`,
  height: "100vh",
  backgroundColor: "#181818",
});

cssClass(cls.header, {
  height: `${headerHeight}px`,
  backgroundColor: "#232325",
  gridArea: "header",
});

cssClass(cls.sidebar, {
  position: "relative",
  gridArea: "sidebar",
  backgroundColor: "#232325",
  overflowY: "overlay",
  width: "300px",
});

cssClass(cls.sidebarFocusContainer, {
  transition: "margin 200ms ease-out",
  position: "relative",
});

cssText(`
  .${cls.sidebar}::-webkit-scrollbar {
    width: 0;
  }
  
  .${cls.sidebar}::-webkit-scrollbar-thumb {
    background-color: rgba(63, 63, 97, 0.8);
  }
  
  .${cls.sidebar}:hover::-webkit-scrollbar {
    width: 8px;
  }`);

cssClass(cls.sidebarRow, {
  marginLeft: "2px",
  color: "white",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  cursor: "pointer",
  transition: "opacity 200ms ease-out",
});
css(`.${cls.sidebarRow}:hover`, {
  backgroundColor: "#333336",
});

cssClass(cls.sidebarRowExpandButton, {
  width: "14px",
  height: "14px",
  color: "rgb(184, 184, 184)",
  transition: `transform ${expandCollapseTransitionTime}ms ease-out, 
                 opacity ${expandCollapseTransitionTime}ms ease-out`,
  opacity: "0",
});

cssClass(cls.sidebarRowExpandButtonContainer, {
  padding: "2px",
  color: "gray",
  ...styles.flexCenter,
});
css(
  [
    `.${cls.sidebarFocusContainerFocused} .${cls.sidebarRow}`,
    `.${cls.sidebarRowFocused} .${cls.sidebarRowExpandButtonContainer}`,
  ],
  {
    opacity: "0",
    pointerEvents: "none",
  }
);
css(
  [
    `.${cls.sidebarRowFocused}.${cls.sidebarRow}`,
    `.${cls.sidebarRowChildrenContainerFocused} .${cls.sidebarRow}`,
  ],
  {
    opacity: "1",
    pointerEvents: "auto",
  }
);

css(
  `.${cls.sidebarRowExpandButtonContainer}:hover > .${cls.sidebarRowExpandButton}`,
  {
    color: "white",
  }
);

css(`.${cls.sidebar}:hover .${cls.sidebarRowExpandButton}`, {
  opacity: "1",
});

cssClass(cls.rotated, {
  transform: "rotateZ(90deg)",
});

cssClass(cls.hidden, {
  visibility: "hidden",
  pointerEvents: "none",
});

cssClass(cls.sidebarRowText, {
  padding: "4px",
  transition: `
  font-size ${expandCollapseTransitionTime}ms ease-out, 
  margin-bottom ${expandCollapseTransitionTime}ms ease-out, 
  padding ${expandCollapseTransitionTime}ms ease-out`,
  whiteSpace: "nowrap",
});
css(`.${cls.sidebarRowFocused} .${cls.sidebarRowText}`, {
  fontSize: "22px",
  padding: "0 4px",
  marginBottom: "2px",
});

cssClass(cls.sidebarRowChildrenContainer, {
  transition: `height ${expandCollapseTransitionTime}ms ease-out`,
  overflow: "hidden",
});

cssClass(cls.sidebarRowCircle, {
  minWidth: "6px",
  width: "6px",
  height: "6px",
  borderRadius: "3px",
  backgroundColor: "rgb(184, 184, 184)",
  color: "rgb(184, 184, 184)",
  margin: "0 2px",
  transition: "transform 200ms ease-out, color 200ms ease-out",
});

css(`.${cls.sidebarRowFocused} .${cls.sidebarRowCircle}`, {
  backgroundColor: "rgba(0,0,0,0)",
  minWidth: "10px",
  width: "10px",
  height: "20px",
  margin: "0",
});

css(`.${cls.sidebarRowCircle}:hover`, {
  transform: "scale(1.6)",
  backgroundColor: "white",
  color: "white",
});

css(`.${cls.sidebarRowCircle}:active`, {
  transform: "scale(1.2)",
});

css(`.${cls.sidebarRowFocused} .${cls.sidebarRowCircle}:hover`, {
  color: "white",
  backgroundColor: "rgba(0,0,0,0)",
  transform: "scale(1.2)",
});

cssClass(cls.unfocusButton, {
  ...styles.absoluteTopRight(5, 5),
  zIndex: "200",
});
