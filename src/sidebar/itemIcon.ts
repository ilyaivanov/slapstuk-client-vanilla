import { cls, s, icons, colors } from "../infra";
import * as items from "../items";
import * as player from "../player/controller";
import * as controller from "./controller";

const focus = (item: Item, e: MouseEvent) => {
  e.stopPropagation();
  controller.onCirclePressed(item);
};
const play = (item: Item, e: MouseEvent) => {
  e.stopPropagation();
  player.playItem(item.id);
};
export const viewItemIcon = (item: Item) =>
  items.isVideo(item)
    ? icons.play([cls.itemIcon, cls.sidebarVideoIcon], {
        click: (e) => play(item, e),
      })
    : items.isChannel(item)
    ? icons.userAvatar([cls.itemIcon, cls.sidebarChannelIcon], {
        click: (e) => focus(item, e),
      })
    : items.isPlaylist(item)
    ? icons.bars([cls.itemIcon, cls.sidebarPlaylistIcon], {
        click: (e) => focus(item, e),
      })
    : icons.circle([cls.itemIcon, cls.sidebarFolderIcon], {
        click: (e) => focus(item, e),
      });

s.class(cls.itemIcon, {
  minWidth: 10,
  width: 10,
  marginRight: 6,
  marginLeft: 4,
  color: colors.iconRegular,
  transition: "transform 100ms ease-out, color 100ms ease-out",
});

s.class(cls.sidebarFolderIcon, {
  minWidth: 6,
  width: 6,
  color: colors.iconRegular,
});

s.hover(cls.sidebarFolderIcon, {
  color: colors.iconHover,
});

s.class(cls.sidebarVideoIcon, {
  color: colors.videoColor,
});

s.class(cls.sidebarChannelIcon, {
  color: colors.channelColor,
});
s.class(cls.sidebarPlaylistIcon, {
  color: colors.playlistColor,
});

s.hover(cls.itemIcon, {
  transform: "scale(1.5)",
});
s.active(cls.itemIcon, {
  transform: "scale(1.5) translate3d(0, 1px, 0)",
});

s.class(cls.sidebarRowCircleChannel, {
  backgroundColor: colors.channelColor,
});

s.class(cls.sidebarRowCirclePlaylist, {
  backgroundColor: colors.playlistColor,
});

s.class(cls.circlePlaying, {
  animation: "pulsate 0.6s ease-in-out infinite both",
});

s.text(`
  @keyframes pulsate {
    0% {
      transform: scale(1) translate3d(0px, 0px, 0px);
    }
    33% {
      transform: scale(1.4, 0.9) translate3d(0px, 3px, 0px);
    }
    66% {
      transform: scale(0.9, 1.1) translate3d(0px, -1px, 0px);
    }
    100% {
      transform: scale(1) translate3d(0px, 0px, 0px);
    }
  }`);
