import { cls, colors, cssText, styles, cssClass } from "../infra";

export const gap = 20;
export const galleryFadeSpeed = 150;
cssClass(cls.gallery, {
  backgroundColor: colors.gallery,
  paddingTop: `${gap}px`,
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  alignContent: "flex-start",
  overflowY: "hidden",
  overflowX: "overlay",
});

cssText(styles.cssTextForScrollBar(cls.gallery, { height: 12 }));

cssClass(cls.card, {
  color: "white",
  width: "322px",
  backgroundColor: colors.card,
  marginLeft: `${gap}px`,
  marginBottom: `${gap}px`,
  borderRadius: "4px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "1px 2px 5px 0px rgba(0, 0, 0, 0.53)",
  maxHeight: "calc(100% - 20px)",
  cursor: "pointer",
});

cssClass(cls.cardImage, {
  display: "block",
});

cssClass(cls.cardText, {
  padding: "8px",
  fontSize: "14px",
  color: "rgb(220, 220, 220)",
  fontWeight: "400",
});

cssClass(cls.galleryEndSpace, {
  height: "100%",
  width: `${gap}px`,
});
