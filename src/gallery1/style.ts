import { cls, css, colors, cssText, styles, cssClass } from "../infra";
import * as playerStyle from "../player/styles";
import { headerHeight } from "../sidebar/styles";

export const gap = 20;
export const galleryFadeSpeed = 150;
export const cardExpandCollapseSpeed = 200;
export const cardHeaderHeight = 35;

//CARDS
cssClass(cls.card, {
  color: "white",
  backgroundColor: colors.card,
  marginBottom: `${gap}px`,
  borderRadius: "4px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "1px 2px 5px 0px rgba(0, 0, 0, 0.53)",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  transition: playerStyle.backgroundTransition,
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

const triangleWidth = 25;

cssClass(cls.cardTypeBox, {
  position: "absolute",
  pointerEvents: "none",
  top: "0",
  right: "0",
  width: `${triangleWidth}px`,
  height: `${triangleWidth}px`,
});

cssClass(cls.cardTypeBoxTriangle, {
  width: "0",
  height: "0",
  pointerEvents: "auto",
  borderLeft: `${triangleWidth}px solid transparent`,
});

cssClass(cls.cardTypeBoxTrianglePlaylist, {
  borderTop: `${triangleWidth}px solid rgba(30, 170, 0, 0.6)`,
});

cssClass(cls.cardTypeBoxTriangleChannel, {
  borderTop: `${triangleWidth}px solid rgba(0, 112, 221, 0.6)`,
});

cssClass(cls.cardTypeBoxTriangleFolder, {
  borderTop: `${triangleWidth}px solid rgba(0, 0, 0, 0.6)`,
});

cssClass(cls.cardTypeBoxTextContainer, {
  position: "absolute",
  top: "1px",
  right: "4px",
  fontSize: "12px",
  fontWeight: "500",
  color: "white",
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
  // maxHeight: `800px`,
  //window.innerHeight and blah-blah for inline animations
  // maxHeight: `calc(100vh - ${
  //   gap * 2 + headerHeight + playerStyle.playerHeight + 73
  // }px)`,
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
  transition: playerStyle.backgroundTransition,
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

const imageHeight = 180;
cssClass(cls.cardImage, {
  display: "block",
  opacity: "1",
  transition: `
    margin-top ${cardExpandCollapseSpeed}ms linear, 
    height ${cardExpandCollapseSpeed}ms linear, 
    opacity ${cardExpandCollapseSpeed}ms ease-out`,
  width: `100%`,
  // height: "100%",
  // maxHeight: "50%",
  objectFit: "cover",
});

cssClass(cls.cardImageHidden, {
  marginTop: `-${imageHeight}px`,
  opacity: "0",
});

cssClass(cls.folderImages, {
  display: "flex",
  flexDirection: "row",
});

cssClass(cls.folderImagesSubContanier, {
  flex: "1",
});

css(`.${cls.folderImages} img`, {
  width: "100%",
  // height: "100%",
  // maxHeight: "50%",
  display: "block",
});

cssClass(cls.folderImagesEmpty, {
  color: "gray",
  fontSize: "40px",
  ...styles.flexCenter,
});
