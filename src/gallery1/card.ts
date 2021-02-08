import { anim, cls, dom, ids, DivDefinition, styles, utils } from "../infra";
import * as style from "./style";
import * as player from "../player/controller";
import * as sidebar from "../sidebar/controller";
import * as items from "../items";
import { loadItemChildren } from "../search/controller";
import { itemPreview } from "./cardPreviewImage";
import * as dnd from "../dnd/dnd";

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
        mousedown: () => dnd.onItemMouseDown(item.id, "gallery-card"),
        click: (e) => {
          if (e.ctrlKey && !items.isVideo(item)) {
            sidebar.selectItem(item.id);
          } else if (items.isContainer(item)) {
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
          attributes: {
            title: items.isFolder(item)
              ? "You created this Folder"
              : items.isChannel(item)
              ? "Youtube Channel"
              : items.isPlaylist(item)
              ? "Youtube Playlist"
              : cls.none,
          },
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

export const viewSubtrack = (item: Item): DivDefinition => ({
  id: ids.subtrack(item.id),
  className: [
    cls.subtrack,
    player.itemIdBeingPlayed == item.id ? cls.itemBeingPlayed : cls.none,
  ],
  on: {
    mousedown: () => dnd.onItemMouseDown(item.id, "card-subtrack"),
    click: (e) => {
      e.stopPropagation();
      if (e.ctrlKey && !items.isVideo(item)) {
        sidebar.selectItem(item.id);
      } else if (items.isPlaylist(item)) {
        if (items.isNeedsToBeLoaded(item)) {
          const row = e.currentTarget as HTMLElement;
          const imageContainer = dom.findFirstByClass(cls.subtrackImage, row);
          const loader = dom.append(imageContainer, {
            style: {
              ...styles.overlay,
              ...styles.flexCenter,
            },
            children: {
              style: {
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: utils.hexToRGBA(style.getItemColor(item), 0.8),
                animation: "pulsate 0.4s ease-in-out infinite both",
              },
            },
          });
          loadItemChildren(item).then((newItems) => {
            items.setChildren(item.id, newItems);
            player.playItem(newItems[0].id);
            loader.remove();
          });
        } else {
          player.playItem(items.getChildren(item.id)[0].id);
        }
      } else if (items.isVideo(item)) player.playItem(item.id);
    },
  },
  children: [
    {
      className: [cls.subtrackImage, getSubtrackImageType(item)],
      children: {
        type: "img",
        attributes: { src: items.getFirstImage(item) },
      },
    },
    { type: "span", children: item.title },
  ],
});

const getSubtrackImageType = (item: Item) =>
  items.isChannel(item)
    ? cls.subtrackChannelImage
    : items.isFolder(item)
    ? cls.subtrackFolderImage
    : items.isPlaylist(item)
    ? cls.subtrackPlaylistImage
    : cls.none;

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
    loadItemChildren(item).then((newItems) => doneLoading(newItems));
  }
};

const animateItemImageHeight = (elem: HTMLElement, item: ItemContainer) => {
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
      ? anim.animateHeight(elem, 0, style.getExpandedHeight(elem))
      : anim.animateHeight(elem, style.getExpandedHeight(elem), 0);
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
    let animation: Animation;
    if (items.isOpenAtGallery(item)) {
      const subitems = dom.fragment(viewSubtracksContent(item));
      subtracksContainer.appendChild(subitems);
      const maxHeight = style.getMaxHeightForSubitemsInPixels();
      const targetHeight = Math.min(maxHeight, subtracksContainer.scrollHeight);
      animation = anim.animateHeight(
        subtracksContainer,
        initialHeightDuringExpand,
        targetHeight
      );
    } else {
      animation = anim.animateHeight(
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
