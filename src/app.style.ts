import { cls, colors, cssText, css, cssClass, zIndexes } from "./infra";
import * as sidebarStyle from "./sidebar/styles";

const defaultSidebarWidth = 300;
cssText(`
body{
  overflow: hidden;
}`);

cssClass(cls.page, {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gridTemplateRows: "auto 1fr auto",
  gridTemplateAreas: `
    "header header"
    "sidebar gallery"
    "player player"`,
  backgroundColor: colors.gallery,
  height: "100vh",
});

cssClass(cls.header, {
  height: `${sidebarStyle.headerHeight}px`,
  backgroundColor: colors.menu,
  gridArea: "header",
  zIndex: zIndexes.topMenu,
});

cssClass(cls.sidebar, {
  position: "relative",
  gridArea: "sidebar",
  overflowY: "overlay",
  backgroundColor: colors.menu,
  boxShadow: "1px 2px 15px 5px rgba(0, 0, 0, 0.53)",
  zIndex: zIndexes.leftSidebarMenu,
  width: `${defaultSidebarWidth}px`,
  transition: "margin 200ms ease-out",
});

cssClass(cls.sidebarHidden, {
  marginLeft: -defaultSidebarWidth + "px",
});

cssClass(cls.gallery, {
  gridArea: "gallery",
});

cssClass(cls.player, {
  gridArea: "player",
});

css("body", {
  margin: "0",
  backgroundColor: colors.gallery,
  fontFamily: `"Roboto", "Source Sans Pro", "Trebuchet MS", "Lucida Grande", "Bitstream Vera Sans", "Helvetica Neue", sans-serif`,
});

css("*", {
  boxSizing: "border-box",
});

//taked from https://loading.io/css/
cssText(`
.load-grid-container{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.load-grid {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.load-grid div {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  animation: load-grid 1.2s linear infinite;
}
.load-grid div:nth-child(1) {
  top: 8px;
  left: 8px;
  animation-delay: 0s;
}
.load-grid div:nth-child(2) {
  top: 8px;
  left: 32px;
  animation-delay: -0.4s;
}
.load-grid div:nth-child(3) {
  top: 8px;
  left: 56px;
  animation-delay: -0.8s;
}
.load-grid div:nth-child(4) {
  top: 32px;
  left: 8px;
  animation-delay: -0.4s;
}
.load-grid div:nth-child(5) {
  top: 32px;
  left: 32px;
  animation-delay: -0.8s;
}
.load-grid div:nth-child(6) {
  top: 32px;
  left: 56px;
  animation-delay: -1.2s;
}
.load-grid div:nth-child(7) {
  top: 56px;
  left: 8px;
  animation-delay: -0.8s;
}
.load-grid div:nth-child(8) {
  top: 56px;
  left: 32px;
  animation-delay: -1.2s;
}
.load-grid div:nth-child(9) {
  top: 56px;
  left: 56px;
  animation-delay: -1.6s;
}
@keyframes load-grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
`);
