import { cls, colors, css, cssClass, ids, styles, zIndexes } from "../infra";

export const playerHeight = 70;
export const backgroundTransition = "background-color 200ms ease-out";
export const playerVisibilityTransition = "200ms ease-out";

styles.setPlayerHeightRootVariable(0);

cssClass(cls.player, {
  height: playerHeight + "px",
  backgroundColor: colors.menu,
  zIndex: zIndexes.player,
});

css(`.${cls.page} .${cls.gallery} .${cls.itemBeingPlayed}`, {
  backgroundColor: colors.cardBeingPlayedBackground,
});

css("#" + ids.youtubeIframe, {
  position: "absolute",
  right: "20px",
  bottom: playerHeight + 20 + "px",
  width: "400px",
  height: "150px",
  opacity: 1,
  transform: "translate3d(0, 0, 0)",
  transition: "opacity 200ms ease-out, transform 200ms ease-out",
});

cssClass(cls.player, {
  position: "relative",
  transition: `margin ${playerVisibilityTransition}`,
});

cssClass(cls.player, {
  marginBottom: -playerHeight + "px",
});

css(`#${ids.youtubeIframe}.${cls.youtubePlayerHidden}`, {
  opacity: 0,
  pointerEvents: "none",
  transform: "translate3d(0, 10px, 0)",
});
