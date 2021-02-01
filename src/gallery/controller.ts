import {
  anim,
  cls,
  dom,
  ids,
  DivDefinition,
  cssClass,
  css,
  styles,
  ClassName,
} from "../infra";
import * as style from "./style";
import * as player from "../player/controller";
import * as items from "../items";
import { fetchPlaylistVideos } from "../api/youtubeRequest";

export const renderItems = (newItems: Item[]) => {
  const gallery = dom.findFirstByClass(cls.gallery);
  const preparedViews = dom.fragment(newItems.map(viewCard));

  if (!dom.isEmpty(gallery)) {
    //extract this to a crossfade animation
    const from: Keyframe = {
      opacity: 1,
      transform: "translate3d(0, 0, 0)",
    };
    const toHide: Keyframe = {
      opacity: 0,
      transform: "translate3d(-20px, 0, 0)",
    };
    const toAppear: Keyframe = {
      opacity: 0,
      transform: "translate3d(20px, 0, 0)",
    };

    const animation = gallery.animate([from, toHide], {
      fill: "forwards",
      duration: style.galleryFadeSpeed,
      easing: "ease-in",
    });
    animation.addEventListener("finish", () => {
      renderGallery(preparedViews);
      gallery.animate([toAppear, from], {
        fill: "forwards",
        duration: style.galleryFadeSpeed,
        easing: "ease-out",
      });
    });
  } else {
    renderGallery(preparedViews);
  }
};

const renderGallery = (views: Node) => {
  const gallery = dom.findFirstByClass(cls.gallery);
  gallery.innerHTML = "";

  gallery.appendChild(views);
};

const toggleCardExpandCollapse = (item: Item) => {
  if (items.isPlaylistNeedToBeLoaded(item)) {
    console.log("Loading YT playlist", item.title);
    const mapItem = (backItem: any): Item => ({
      title: backItem.name,
      itemType: "video",
      id: backItem.id,
      children: [],
      videoId: backItem.itemId,
    });
    if (item.playlistId) {
      fetchPlaylistVideos(item.playlistId)
        .then((response) => response.items.map(mapItem))
        .then((newItems) => {
          items.setChildren(item.id, newItems);
          const card = dom.findById("card-" + item.id);
          const cardSubtracksContainer = dom.findFirstByClass(
            cls.subtracksContainer,
            card
          );
          cardSubtracksContainer.innerHTML = "";
          const subs = viewSubtracks(item.id);
          cardSubtracksContainer.appendChild(dom.fragment(subs));
        });
    }
  }
  const card = dom.findById("card-" + item.id);
  item.isOpenInGallery = !item.isOpenInGallery;
  const cardImage = dom.findFirstByClass(cls.cardImage, card);
  const cardSubtracksContainer = dom.findFirstByClass(
    cls.subtracksContainer,
    card
  );
  const content = items.isPlaylistLoading(item)
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

//VIEW
const viewCard = (item: Item): DivDefinition => ({
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
          if (item.itemType == "video") player.playItem(item.id);
          else toggleCardExpandCollapse(item);
        },
      },
      children: [
        folderPreview(item),
        {
          className: [
            cls.cardText,
            item.children.length > 0 ? cls.cardTextForFolder : cls.none,
          ],
          children: item.title,
        },
      ],
    },
    {
      className: cls.subtracksContainer,
      children: item.isOpenInGallery ? viewSubtracks(item.id) : [],
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
      if (item.videoId) player.playItem(item.id);
    },
  },
  children: [
    {
      type: "img",
      className: cls.subtrackImage,
      attributes: { src: getFirstImage(item) },
    },
    { type: "span", children: item.title },
  ],
});

// CSS grid here
const imageHeight = 180;
const imageWidth = 320;
cssClass(cls.cardImage, {
  display: "block",
  opacity: "1",
  transition: `
    margin-top ${style.cardExpandCollapseSpeed}ms linear, 
    opacity ${style.cardExpandCollapseSpeed}ms ease-out`,
  width: `${imageWidth}px`,
  height: `${imageHeight}px`,
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
  height: "100%",
  display: "block",
  objectFit: "cover",
});

cssClass(cls.folderImagesEmpty, {
  color: "gray",
  fontSize: "40px",
  ...styles.flexCenter,
});

const folderPreview = (item: Item): DivDefinition => {
  const children = items.getChildren(item.id);

  const containerClasses: ClassName[] = [
    cls.cardImage,
    item.isOpenInGallery ? cls.cardImageHidden : cls.none,
  ];

  if (!items.isFolder(item) || children.length == 1) {
    let src = !items.isFolder(item)
      ? getImageSrc(item)
      : getPreviewImages(item);
    return {
      type: "img",
      className: containerClasses,
      attributes: { src, draggable: "false" },
    };
  }
  const previewImages = getPreviewImages(item);
  if (previewImages.length === 0)
    return {
      className: containerClasses.concat([cls.folderImagesEmpty]),
      children: "Empty",
    };
  return {
    className: containerClasses.concat([cls.folderImages]),
    children: previewImages.map((src) => ({
      className: cls.folderImagesSubContanier,
      children: {
        type: "img",
        attributes: { src },
      },
    })),
  };
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

const getPreviewImages = (item: Item): string[] =>
  items
    .getChildren(item.id)
    .map(getFirstImage)
    .filter((x) => !!x)
    .slice(0, 2) as string[];

const getFirstImage = (item: Item): string | undefined => {
  if (items.isFolder(item)) {
    const children = items.getChildren(item.id);
    return children.map(getFirstImage).filter((x) => !!x)[0] as string;
  }
  return getImageSrc(item) as string;
};

const getImageSrc = (item: Item): string | undefined => {
  if (item.image) return item.image;
  else if (item.videoId)
    return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
  else return undefined;
};
