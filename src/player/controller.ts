import { cls, dom, ids, styles } from "../infra";
import { play } from "./youtubePlayer";
import * as items from "../items";
import * as sidebarView from "../sidebar/view";
import * as style from "./styles";

export let itemIdBeingPlayed = "";
let hasPlayer = false;

export const playNext = () => {
  const nextItem = items.getNextItem(itemIdBeingPlayed);
  if (nextItem) playItem(nextItem.id);
};

export const onVideoEnd = () => {
  playNext();
};

export const playItem = (itemId: string) => {
  if (!hasPlayer) {
    hasPlayer = true;
    dom
      .findFirstByClass(cls.player)
      .appendChild(dom.fragment([{ id: ids.youtubeIframe }]));
  }
  const item = items.getItem(itemId);
  if (item && items.isVideo(item) && item.videoId) {
    if (itemIdBeingPlayed) removeItemBeingPlayedFromItem(itemIdBeingPlayed);

    addItemBeingPlayedToItem(itemId);

    itemIdBeingPlayed = itemId;
    play(item.videoId);
  }
};

export const toggleVisibility = () => {
  //TODO: this won't work properly if I'm saving player visibility config
  //it assumes player is always hidden initialliy
  const player = dom.findFirstByClass(cls.player);
  if (player.classList.contains(cls.playerHidden)) {
    styles.setPlayerHeightRootVariable(style.playerHeight);
    player.classList.remove(cls.playerHidden);
  } else {
    styles.setPlayerHeightRootVariable(0);
    player.classList.add(cls.playerHidden);
  }
};

export const toggleYoutubePlayerVisibility = () => {
  dom.findById(ids.youtubeIframe).classList.toggle(cls.youtubePlayerHidden);
};

const removeItemBeingPlayedFromItem = (itemId: string) => {
  let parent = items.findParentItem(itemId);

  while (parent && parent.id !== "HOME") {
    performActionOnACircleIfRendered(parent.id, (circle) =>
      circle.classList.remove(cls.circlePlaying)
    );
    parent = items.findParentItem(parent.id);
  }
  console.log(itemId);
  dom.removeClassFromElementById(ids.card(itemId), cls.itemBeingPlayed);
  dom.removeClassFromElementById(ids.subtrack(itemId), cls.itemBeingPlayed);
};

const addItemBeingPlayedToItem = (itemId: string) => {
  let parent = items.findParentItem(itemId);

  while (parent && parent.id !== "HOME") {
    performActionOnACircleIfRendered(parent.id, (circle) =>
      circle.classList.add(cls.circlePlaying)
    );
    parent = items.findParentItem(parent.id);
  }
  dom.addClassToElementById(ids.card(itemId), cls.itemBeingPlayed);
  dom.addClassToElementById(ids.subtrack(itemId), cls.itemBeingPlayed);
};

const performActionOnACircleIfRendered = (
  itemId: string,
  action: (elem: HTMLElement) => void
) => {
  const row = dom.maybefindById(sidebarView.rowId(itemId));
  if (row) {
    const circle = sidebarView.findFocusButton(row);
    action(circle);
  }
};
