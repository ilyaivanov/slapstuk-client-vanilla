import { cls, colors, css, cssClass, styles, zIndexes } from "../infra";

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

css("#youtubePlayer", {
  position: "absolute",
  right: "20px",
  bottom: playerHeight + 20 + "px",
  width: "400px",
  height: "150px",
});

cssClass(cls.player, {
  position: "relative",
  transition: `margin ${playerVisibilityTransition}`,
});

cssClass(cls.playerHidden, {
  marginBottom: -playerHeight + "px",
});
