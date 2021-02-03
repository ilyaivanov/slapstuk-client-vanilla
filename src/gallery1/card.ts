import { anim, cls, dom, ids, DivDefinition, styles } from "../infra";
import * as style from "./style";
import * as player from "../player/controller";
import * as items from "../items";
import * as api from "../api/youtubeRequest";
import { mapReponseItem } from "../search/controller";
import { itemPreview } from "./cardPreviewImage";

//VIEW
export const viewCard = (item: Item): DivDefinition => ({
  id: ids.card(item.id),
  className: [
    cls.card,
    player.itemIdBeingPlayed == item.id ? cls.itemBeingPlayed : cls.none,
  ],
  children: [
    {
      className: cls.cardImageWithTextContainer,
      on: {
        click: () => {
          if (items.isContainer(item)) {
            const card = dom.findById(ids.card(item.id));
            const imageContainer = dom.findFirstByClass(
              cls.cardPreviewContainer,
              card
            );
            items.toggleIsCollapsedInGallery(item);
            animateItemImageHeight(imageContainer, item);
            const subtracksContainer = dom.findFirstByClass(
              cls.subtracksContainer,
              card
            );

            loadSubitemsIfNeeded(item, subtracksContainer);
            animateSubtracksContainer(subtracksContainer, item);
          } else player.playItem(item.id);
        },
      },
      children: [
        itemPreview(item),
        {
          className: [
            cls.cardText,
            items.isContainer(item) ? cls.cardTextForFolder : cls.none,
          ],
          children: item.title,
        },
      ],
    },
    {
      className: cls.subtracksContainer,
      children: viewSubtracksContent(item),
    },
    {
      className: cls.cardTypeBox,
      children: [
        {
          className: [
            cls.cardTypeBoxTriangle,
            items.isFolder(item)
              ? cls.cardTypeBoxTriangleFolder
              : items.isChannel(item)
              ? cls.cardTypeBoxTriangleChannel
              : items.isPlaylist(item)
              ? cls.cardTypeBoxTrianglePlaylist
              : cls.none,
          ],
        },
        {
          className: cls.cardTypeBoxTextContainer,
          children: items.isFolder(item)
            ? "F"
            : items.isPlaylist(item)
            ? "P"
            : items.isChannel(item)
            ? "C"
            : "",
        },
      ],
    },
  ],
});

const viewSubtracksContent = (item: Item): DivDefinition[] =>
  items.isOpenAtGallery(item)
    ? items.isLoading(item)
      ? [viewSubtracksLoadingGrid(item)]
      : viewSubtracks(item.id)
    : [];

const viewSubtracks = (itemId: string): DivDefinition[] =>
  items.getChildren(itemId).map(viewSubtrack);

const viewSubtrack = (item: Item): DivDefinition => ({
  id: ids.subtrack(item.id),
  className: [
    cls.subtrack,
    player.itemIdBeingPlayed == item.id ? cls.itemBeingPlayed : cls.none,
  ],
  on: {
    click: (e) => {
      e.stopPropagation();
      if (items.isVideo(item)) player.playItem(item.id);
    },
  },
  children: [
    {
      type: "img",
      className: cls.subtrackImage,
      attributes: { src: items.getFirstImage(item) },
    },
    { type: "span", children: item.title },
  ],
});

const viewSubtracksLoadingGrid = (item: Item): DivDefinition => ({
  style: {
    ...styles.flexCenter,
    margin: "10px",
    marginTop: "0",
  },
  children: {
    className: cls.loadGrid,

    children: Array.from(new Array(9)).map(() => ({
      style: {
        backgroundColor: style.getItemColor(item),
      },
    })),
  },
});

const loadSubitemsIfNeeded = (
  item: ItemContainer,
  subtracksContainer: HTMLElement
) => {
  const doneLoading = (newItems: Item[]) => {
    items.stopLoading(item);
    items.setChildren(item.id, newItems);
    const initialHeight = subtracksContainer.clientHeight;
    subtracksContainer.innerHTML = ``;
    //this is tricky. If items will be fetched during current animation, I do not need to revert animations (as if during click)
    styles.cancelAllCurrentAnimations(subtracksContainer);

    animateSubtracksContainer(subtracksContainer, item, initialHeight);
  };

  if (items.isOpenAtGallery(item) && items.isContainerNeedToFetch(item)) {
    items.startLoading(item);
    if (item.type == "YTplaylist") {
      item.isLoading = true;
      api
        .fetchPlaylistVideos(item.playlistId)
        .then((response) => response.items.map(mapReponseItem))
        .then((newItems) => doneLoading(newItems));
    }
    if (item.type == "YTchannel") {
      item.isLoading = true;
      Promise.all([
        api.getChannelPlaylists(item.channelId),
        api.getChannelUploadsPlaylistId(item.channelId),
      ])
        .then(([channelPlaylists, uploadsPlaylistId]) =>
          [
            {
              type: "YTplaylist",
              children: [],
              id: Math.random() + "",
              image: item.image,
              playlistId: uploadsPlaylistId,
              title: item.title + " - Uploads",
            } as Item,
          ].concat(channelPlaylists.items.map(mapReponseItem))
        )
        .then((newItems) => doneLoading(newItems));
    }
  }
};

const boxAnimationSpeed = 1200; //pixels per second

const animateItemImageHeight = (elem: HTMLElement, item: ItemContainer) => {
  const expandBox = () => animateHeight(elem, 0, style.getExpandedHeight(elem));
  const collapseBox = () =>
    animateHeight(elem, style.getExpandedHeight(elem), 0);

  elem.style.paddingBottom = "0";
  const currentAnimation = elem.getAnimations();

  const onAnimationDone = () => {
    if (!items.isOpenAtGallery(item))
      elem.style.paddingBottom = style.initialPaddingPercent;
  };

  if (currentAnimation.length > 0) {
    currentAnimation[0].reverse();
  } else {
    const animation = !items.isOpenAtGallery(item)
      ? expandBox()
      : collapseBox();
    animation.addEventListener("finish", onAnimationDone);
  }
};

const animateSubtracksContainer = (
  subtracksContainer: HTMLElement,
  item: ItemContainer,
  initialHeightDuringExpand = 0
) => {
  const animations = subtracksContainer.getAnimations();
  if (animations.length > 0) animations.forEach((a) => a.reverse());
  else {
    console.log("starting new animation");
    let animation: Animation;
    if (items.isOpenAtGallery(item)) {
      const subitems = dom.fragment(viewSubtracksContent(item));
      subtracksContainer.appendChild(subitems);
      const maxHeight = style.getMaxHeightForSubitemsInPixels();
      const targetHeight = Math.min(maxHeight, subtracksContainer.scrollHeight);
      animation = animateHeight(
        subtracksContainer,
        initialHeightDuringExpand,
        targetHeight
      );
    } else {
      animation = animateHeight(
        subtracksContainer,
        subtracksContainer.clientHeight,
        0
      );
    }
    animation.addEventListener("finish", () => {
      if (!items.isOpenAtGallery(item)) subtracksContainer.innerHTML = "";
    });
  }
};

const animateHeight = (
  elem: HTMLElement,
  from: number,
  to: number
): Animation => {
  const targetOpacity = from > to ? 0 : 1;
  const sourceOpacity = from <= to ? 0 : 1;
  return elem.animate(
    [
      { height: from + "px", opacity: sourceOpacity },
      { height: to + "px", opacity: targetOpacity },
    ],
    {
      duration: getDuration(from, to),
      easing: "ease-out",
    }
  );
};

const getDuration = (from: number, to: number) => {
  const distance = Math.abs(to - from);
  return (distance / boxAnimationSpeed) * 1000;
};
