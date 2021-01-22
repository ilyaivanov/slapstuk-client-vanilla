import { cls, css, colors, cssText, styles, cssClass } from "../infra";

export const gap = 20;
export const galleryFadeSpeed = 150;
export const cardExpandCollapseSpeed = 200;
export const cardHeaderHeight = 35;
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

cssClass(cls.galleryEndSpace, {
  height: "100%",
  width: `${gap}px`,
});

//CARDS
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
  overflow: "hidden",
});

css(`.${cls.card}:hover`, {
  border: "1px solid rgba(255, 255, 255, 0.2)",
});

css(`.${cls.cardImageWithTextContainer}:hover`, {
  backgroundColor: colors.cardHover,
});
css(`.${cls.itemBeingPlayed} .${cls.cardImageWithTextContainer}`, {
  backgroundColor: "inherit",
});

cssClass(cls.cardImage, {
  display: "block",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  opacity: "1",
  transition: `margin-top ${cardExpandCollapseSpeed}ms linear, 
  opacity ${cardExpandCollapseSpeed}ms ease-out`,
  width: "320px",
  height: "180px",
});

cssClass(cls.cardImageHidden, {
  marginTop: "-180px",
  opacity: "0",
});

cssClass(cls.cardText, {
  padding: "8px",
  fontSize: "14px",
  color: "rgb(220, 220, 220)",
  fontWeight: "400",
});

cssClass(cls.cardTextForFolder, {
  fontSize: "16px",
  color: "white",
  fontWeight: "500",
});

//CARD'S SUBSTRACKS

cssClass(cls.subtracksContainer, {
  transition: `height ${cardExpandCollapseSpeed}ms linear`,
  overflowY: "overlay",
  maxHeight: `calc(100% - ${cardHeaderHeight}px)`,
});

cssText(styles.cssTextForScrollBar(cls.subtracksContainer, { width: 8 }));

cssClass(cls.subtrack, {
  padding: "5px 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  fontSize: "14px",
  color: "rgb(220, 220, 220)",
  fontWeight: "400",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
});

css(`.${cls.subtrack}:hover`, {
  backgroundColor: colors.cardHover,
});

cssClass(cls.subtrackImage, {
  width: "32px",
  height: "32px",
  objectFit: "cover",
  borderRadius: "4px",
  marginRight: "8px",
});
