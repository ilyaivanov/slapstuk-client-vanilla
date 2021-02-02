import {
  anim,
  cls,
  dom,
  ids,
  DivDefinition,
  styles,
  ClassName,
  colors,
} from "../infra";
import * as style from "./style";
import * as player from "../player/controller";
import * as items from "../items";
import * as api from "../api/youtubeRequest";
import { mapReponseItem } from "../search/controller";

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
          if (items.isContainer(item)) toggleCardExpandCollapse(item);
          else player.playItem(item.id);
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
      children:
        items.isContainer(item) && item.isOpenInGallery
          ? viewSubtracks(item.id)
          : [],
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

//create css grid here with container of fixed proportions

//so that preview of folders and channels would be of equal height

const itemPreview = (item: Item): DivDefinition => {
  return {
    style: {
      paddingBottom: "56.25%",
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

// const folderPreview = (item: Item): DivDefinition => {
//   const children = items.getChildren(item.id);

//   const containerClasses: ClassName[] = [
//     cls.cardImage,
//     items.isContainer(item) && item.isOpenInGallery
//       ? cls.cardImageHidden
//       : cls.none,
//   ];

//   if (!items.isFolder(item) || children.length == 1) {
//     let src = !items.isFolder(item)
//       ? items.getImageSrc(item)
//       : items.getPreviewImages(item);
//     return {
//       type: "img",
//       className: containerClasses,
//       attributes: { src, draggable: "false" },
//     };
//   }
//   const previewImages = items.getPreviewImages(item);
//   if (previewImages.length === 0)
//     return {
//       className: containerClasses.concat([cls.folderImagesEmpty]),
//       children: "Empty",
//     };
//   return {
//     className: containerClasses.concat([cls.folderImages]),
//     children: previewImages.map((src) => ({
//       className: cls.folderImagesSubContanier,
//       children: {
//         type: "img",
//         attributes: { src },
//       },
//     })),
//   };
// };

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
