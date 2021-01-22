import { cls, dom, ids } from "../infra";
import { play } from "./youtubePlayer";
import * as items from "../items";

export let itemIdBeingPlayed = "";
export const init = () => {
  dom
    .findFirstByClass(cls.player)
    .appendChild(
      dom.fragment([
        { type: "button", on: { click: playNext }, children: "next" },
        { id: "youtubePlayer" },
      ])
    );
};

export const playNext = () => {
  const nextItem = items.getNextItem(itemIdBeingPlayed);
  if (nextItem) playItem(nextItem.id);
};

export const onVideoEnd = () => {
  playNext();
};

export const playItem = (itemId: string) => {
  const item = items.getItem(itemId);
  if (item && item.videoId) {
    if (itemIdBeingPlayed) removeItemBeingPlayedFromItem(itemIdBeingPlayed);

    addItemBeingPlayedToItem(itemId);

    itemIdBeingPlayed = itemId;
    play(item.videoId);
  }
};

const removeItemBeingPlayedFromItem = (itemId: string) => {
  dom.removeClassFromElementById(ids.card(itemId), cls.itemBeingPlayed);
  dom.removeClassFromElementById(ids.subtrack(itemId), cls.itemBeingPlayed);
};

const addItemBeingPlayedToItem = (itemId: string) => {
  dom.addClassToElementById(ids.card(itemId), cls.itemBeingPlayed);
  dom.addClassToElementById(ids.subtrack(itemId), cls.itemBeingPlayed);
};
