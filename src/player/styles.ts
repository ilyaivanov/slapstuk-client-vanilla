import { cls, colors, css, cssClass, zIndexes } from "../infra";

export const playerHeight = 70;
export const backgroundTransition = 'background-color 200ms ease-out'
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
  transition: "margin 200ms ease-out",
});

cssClass(cls.playerHidden, {
  marginBottom: -playerHeight + "px",
});
