import { anim, cls, dom, ids, DivDefinition, styles } from "../infra";
import * as style from "./style";
import * as player from "../player/controller";
import * as items from "../items";
import * as api from "../api/youtubeRequest";
import { mapReponseItem } from "../search/controller";
import { headerHeight } from "../sidebar/styles";
import { playerHeight } from "../player/styles";
import { gap } from "./style";

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
              "item-preview-container" as any,
              card
            );
            console.log(item.isOpenInGallery);
            item.isOpenInGallery = !items.isOpenAtGallery(item);
            animateItemImageHeight(imageContainer, item);
            const subtracksContainer = dom.findFirstByClass(
              cls.subtracksContainer,
              card
            );
            animateSubtracksContainer(subtracksContainer, item);

            // const subtracks =viewSubtracks(item.id);
            // const frag = dom.fragment(subtracks);

            // console.log(frag.)
          }

          // if (items.isContainer(item)) toggleCardExpandCollapse(item);
          // else player.playItem(item.id);
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
      children: items.isOpenAtGallery(item) ? viewSubtracks(item.id) : [],
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

const viewSubtracks = (itemId: string) =>
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

const initialPadding = 56.25; //aspect ratio of a 320 x 180 image
const initialPaddingPercent = initialPadding + "%";

//I need to convert relative percents to absolute points before animations
//aftert animation end I will place percents back, so that card would remain fluid
const getExpandedHeight = (box: HTMLElement) =>
  box.clientWidth * (initialPadding / 100);

const itemPreview = (item: Item): DivDefinition => {
  return {
    className: "item-preview-container" as any,
    style: {
      overflow: "hidden",
      paddingBottom: items.isOpenAtGallery(item) ? "0" : initialPaddingPercent,
      position: "relative",
    },
    children: getPreviewImage(item),
  };
};

const getPreviewImage = (item: Item): DivDefinition => {
  if (!items.isFolder(item))
    return {
      type: "img",
      style: {
        ...styles.overlay,
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover",
        //this makes animation better for non-channel items
        objectPosition: items.isChannel(item) ? undefined : "top",
      },
      attributes: { src: items.getImageSrc(item) },
    };
  else {
    return folderPreviewGrid(item);
  }
};

const folderPreviewGrid = (item: Folder): DivDefinition => {
  const previewImages = items.getPreviewImages(item, 4);
  if (previewImages.length == 0)
    return {
      style: {
        ...styles.flexCenter,
        ...styles.overlay,
        color: "gray",
        fontSize: "40px",
      },
      children: "Empty",
    };
  return {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridTemplateRows: "1fr 1fr",
      gridGap: "2px",
      ...styles.overlay,
    },
    children: items.getPreviewImages(item, 4).map((src) => ({
      type: "img",
      style: {
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover",
      },
      attributes: { src },
    })),
  };
};

const toggleCardExpandCollapse = (item: ItemContainer) => {
  if (items.isNeedsToBeLoaded(item)) {
    const doneLoading = (newItems: Item[]) => {
      if (item.type == "YTplaylist") {
        item.isLoading = false;
      } else if (item.type == "YTchannel") {
        item.isLoading = false;
      }
      items.setChildren(item.id, newItems);
      const card = dom.findById("card-" + item.id);
      const cardSubtracksContainer = dom.findFirstByClass(
        cls.subtracksContainer,
        card
      );
      cardSubtracksContainer.innerHTML = "";
      const subs = viewSubtracks(item.id);
      cardSubtracksContainer.appendChild(dom.fragment(subs));
    };
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
  const card = dom.findById("card-" + item.id);
  item.isOpenInGallery = !item.isOpenInGallery;
  const cardImage = dom.findFirstByClass(cls.cardImage, card);
  const cardSubtracksContainer = dom.findFirstByClass(
    cls.subtracksContainer,
    card
  );
  const content = items.isLoading(item)
    ? viewSubtracksLoadingGrid()
    : viewSubtracks(item.id);
  if (item.isOpenInGallery) {
    cardImage.classList.add(cls.cardImageHidden);
    const gallery = dom.findFirstByClass(cls.gallery);
    anim.openElementHeight(
      cardSubtracksContainer,
      content,
      style.cardExpandCollapseSpeed,
      () =>
        Math.min(
          gallery.clientHeight - style.gap * 2,
          cardSubtracksContainer.scrollHeight
        )
    );
  } else {
    cardImage.classList.remove(cls.cardImageHidden);
    anim.collapseElementHeight(
      cardSubtracksContainer,
      style.cardExpandCollapseSpeed
    );
  }
};

const viewSubtracksLoadingGrid = (): DivDefinition => ({
  style: {
    ...styles.flexCenter,
    margin: "10px",
  },
  children: {
    className: cls.loadGrid,

    children: Array.from(new Array(9)).map(() => ({})),
  },
});

const boxAnimationSpeed = 1200; //pixels per second

const animateItemImageHeight = (elem: HTMLElement, item: ItemContainer) => {
  const expandBox = () => animateHeight(elem, 0, getExpandedHeight(elem));
  const collapseBox = () => animateHeight(elem, getExpandedHeight(elem), 0);

  elem.style.paddingBottom = "0";
  const currentAnimation = elem.getAnimations();

  const onAnimationDone = () => {
    if (!items.isOpenAtGallery(item))
      elem.style.paddingBottom = initialPaddingPercent;
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
  item: ItemContainer
) => {
  const animations = subtracksContainer.getAnimations();
  if (animations.length > 0) animations.forEach((a) => a.reverse());
  else {
    let animation: Animation;
    if (items.isOpenAtGallery(item)) {
      const subitems = viewSubtracks(item.id);
      subtracksContainer.appendChild(dom.fragment(subitems));
      const maxHeight = getMaxHeightForSubitemsInPixels(item);
      const targetHeight = Math.min(maxHeight, subtracksContainer.scrollHeight);
      animation = animateHeight(subtracksContainer, 0, targetHeight);
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

const getMaxHeightForSubitemsInPixels = (item: Item): number => {
  const row = dom.findById(ids.card(item.id));
  const text = dom.findFirstByClass(cls.cardText, row);
  return window.innerHeight - getMaxHeightModifiers() - text.clientHeight;
};

export const getMaxHeightForSubitemsInCssCalc = (item: Item): string => {
  const row = dom.findById(ids.card(item.id));
  const text = dom.findFirstByClass(cls.cardText, row);
  return `calc(100vh - ${getMaxHeightModifiers() + text.clientHeight}px)`;
};

//TODO: check if player is visible or not
const getMaxHeightModifiers = () => headerHeight + playerHeight + gap * 2;

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
    }
  );
};

const getDuration = (from: number, to: number) => {
  const distance = Math.abs(to - from);
  return (distance / boxAnimationSpeed) * 1000;
};
