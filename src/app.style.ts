import { cls, colors, cssText, cssClass, zIndexes } from "./infra";
import * as sidebarStyle from "./sidebar/styles";

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
  width: "300px",
});

cssClass(cls.gallery, {
  gridArea: "gallery",
});

cssClass(cls.player, {
  gridArea: "player",
});
