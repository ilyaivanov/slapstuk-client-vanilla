import {
  cls,
  css,
  colors,
  cssText,
  styles,
  cssClass,
  utils,
  cssClassOnHover,
} from "../infra";
import * as playerStyle from "../player/styles";
import { headerHeight } from "../sidebar/styles";
import * as items from "../items";

export const gap = 20;
export const galleryFadeSpeed = 150;
export const cardExpandCollapseSpeed = 200;
const cardPadding = 11;
//Gallery
cssClass(cls.gallery, {
  backgroundColor: colors.gallery,
  position: "relative",
  overflowY: "overlay" as any,
});

cssClass(cls.scrolly, {
  paddingTop: gap,
  paddingRight: gap,
  display: "flex",
  flexDirection: "row",
});

cssText(styles.cssTextForScrollBar(cls.gallery, { width: 8 }));

cssClass(cls.column1, {
  flex: 1,
  marginLeft: gap,
});

//CARDS
const getMaxHeightModifiers = () => headerHeight + gap * 2;
export const getMaxHeightForSubitemsInPixels = (): number => {
  return window.innerHeight - getMaxHeightModifiers();
};

export const initialPadding = 56.25; //aspect ratio of a 320 x 180 image
export const initialPaddingPercent = initialPadding + "%";

//I need to convert relative percents to absolute points before animations
//aftert animation end I will place percents back, so that card would remain fluid
export const getExpandedHeight = (box: HTMLElement) =>
  box.clientWidth * (initialPadding / 100);

cssClass(cls.card, {
  color: "white",
  backgroundColor: colors.card,
  marginBottom: gap,
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  transition: playerStyle.backgroundTransition,
  maxHeight: `calc(100vh - ${getMaxHeightModifiers()}px - var(--player-height))`,
  display: "flex",
  flexDirection: "column",
});
css(`.${cls.page}.${cls.grabbing} .${cls.card}`, {
  cursor: "grabbing",
});

css(`.${cls.ctrlKeyPressed} .${cls.card}`, {
  cursor: "alias",
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
  top: 0,
  right: 0,
  width: triangleWidth,
  height: triangleWidth,
});

cssClass(cls.cardTypeBoxTriangle, {
  width: 0,
  height: 0,
  pointerEvents: "auto",
  borderLeft: `${triangleWidth}px solid transparent`,
});

const triangleAlpha = 0.6;

const triangleBorder = (hex: string, alpha: number) =>
  `${triangleWidth}px solid ${utils.hexToRGBA(hex, alpha)}`;

cssClass(cls.cardTypeBoxTrianglePlaylist, {
  cursor: "auto",
  borderTop: triangleBorder(colors.playlistColor, triangleAlpha),
});

cssClass(cls.cardTypeBoxTriangleChannel, {
  cursor: "auto",
  borderTop: triangleBorder(colors.channelColor, triangleAlpha),
});

cssClass(cls.cardTypeBoxTriangleFolder, {
  cursor: "auto",
  borderTop: triangleBorder(colors.folderColor, triangleAlpha),
});

cssClassOnHover(cls.cardTypeBoxTrianglePlaylist, {
  borderTop: triangleBorder(colors.playlistColor, 1),
});

cssClassOnHover(cls.cardTypeBoxTriangleChannel, {
  borderTop: triangleBorder(colors.channelColor, 1),
});

cssClassOnHover(cls.cardTypeBoxTriangleFolder, {
  borderTop: triangleBorder(colors.folderColor, 1),
});

export const getItemColor = (item: Item) => {
  if (items.isFolder(item)) return colors.folderColor;
  if (items.isChannel(item)) return colors.channelColor;
  if (items.isPlaylist(item)) return colors.playlistColor;
  if (items.isVideo(item)) return colors.videoColor;
  //@ts-expect-error
  console.error(`Unknown item type for ${item.type}. Using white`);
  return "white";
};

cssClass(cls.cardTypeBoxTextContainer, {
  position: "absolute",
  top: 1,
  right: 4,
  fontSize: 12,
  fontWeight: "bolder",
  color: "white",
});

cssClass(cls.cardText, {
  padding: cardPadding,
  fontSize: 14,
  color: "rgb(220, 220, 220)",
  fontWeight: "normal",
  wordBreak: "break-word",
});

cssClass(cls.cardTextForFolder, {
  fontSize: 16,
  color: "white",
  fontWeight: "bolder",
});

//CARD'S SUBSTRACKS

cssClass(cls.subtracksContainer, {
  transition: `height ${cardExpandCollapseSpeed}ms linear`,
  overflowY: "overlay" as any,
});

cssText(styles.cssTextForScrollBar(cls.subtracksContainer, { width: 8 }));

cssClass(cls.subtrack, {
  padding: `5px ${cardPadding}px`,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  fontSize: 13,
  wordBreak: "break-word",
  color: "rgb(220, 220, 220)",
  fontWeight: "normal",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
  transition: playerStyle.backgroundTransition,
});

css(`.${cls.ctrlKeyPressed} .${cls.subtrack}`, {
  cursor: "alias",
});

css(`.${cls.subtrack}:last-of-type`, {
  borderBottom: "none",
});

css(`.${cls.page}.${cls.grabbing} .${cls.subtrack}`, {
  cursor: "grabbing",
});

css(`.${cls.subtrack}:hover`, {
  backgroundColor: colors.cardHover,
});

cssClass(cls.subtrackImage, {
  width: 32,
  height: 32,
  objectFit: "cover",
  borderRadius: 4,
  marginRight: 8,
});

cssClass(cls.subtrackPlaylistImage, {
  border: `2px solid ${colors.playlistColor}`,
});

cssClass(cls.subtrackChannelImage, {
  border: `2px solid ${colors.channelColor}`,
});

cssClass(cls.subtrackFolderImage, {
  border: `2px solid ${colors.folderColor}`,
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
  objectFit: "cover",
});

cssClass(cls.cardImageHidden, {
  marginTop: `-${imageHeight}px`,
  opacity: 0,
});

cssClass(cls.folderImages, {
  display: "flex",
  flexDirection: "row",
});

cssClass(cls.folderImagesSubContanier, {
  flex: 1,
});

css(`.${cls.folderImages} img`, {
  width: "100%",
  // height: "100%",
  // maxHeight: "50%",
  display: "block",
});

cssClass(cls.folderImagesEmpty, {
  color: "gray",
  fontSize: 40,
  ...styles.flexCenter,
});
