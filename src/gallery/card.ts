import {
  anim,
  cls,
  dom,
  ids,
  DivDefinition,
  styles,
  utils,
  itemEvents,
} from "../infra";
import * as style from "./style";
import * as player from "../player/controller";
import * as sidebar from "../sidebar/controller";
import * as items from "../items";
import { LoadingItemsReponse, loadItemChildren } from "../api/search";
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
        mousedown: () => dnd.onItemMouseDown(item.id),
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
          ref: (ref) => {
            itemEvents.addItemListener("title-changed", ref, (i) => {
              if (item.id == i.id) ref.innerText = i.title;
            });
          },
        },
      ],
    },
    {
      className: cls.subtracksContainer,
      on: {
        scroll: (e) => {
          const node = e.currentTarget as HTMLElement;
          const distanceFromBottom =
            node.scrollHeight - node.scrollTop - node.offsetHeight;
          if (distanceFromBottom < 5 && items.needToLoadNextPage(item)) {
            items.startLoading(item);
            var loader = dom.append(node, viewSubtracksLoadingGrid(item));
            loadItemChildren(item).then((response) => {
              items.doneLoadingPage(item, response);
              loader.remove();
              dom.append(node, response.items.map(viewSubtrack));
            });
          }
        },
      },
      children: viewSubtracksContent(item),
    },
    {
      className: cls.cardTypeBox,
      on: {
        click: () => {
          const card = dom.findById(ids.card(item.id));
          dom.findFirstByClass(cls.galleryScrollyContainer).scrollTo({
            top: card.offsetTop - style.gap,
            behavior: "smooth",
          });
        },
      },
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
    mousedown: () => dnd.onItemMouseDown(item.id),
    click: (e) => {
      e.stopPropagation();
      if (e.ctrlKey && !items.isVideo(item)) {
        sidebar.selectItem(item.id);
      } else if (items.isPlaylist(item) && items.isNeedsToBeLoaded(item)) {
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
        item.isLoading = true;
        loadItemChildren(item).then((response) => {
          items.doneLoadingPage(item, response);
          player.playItem(response.items[0].id);
          loader.remove();
        });
      } else if (items.isVideo(item)) {
        player.playItem(item.id);
      } else if (items.isContainer(item)) {
        const video = items.getFirstVideo(item);
        if (video) player.playItem(video.id);
      }
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
    {
      type: "span",
      children: item.title,
      ref: (ref) => {
        itemEvents.addItemListener("title-changed", ref, (i) => {
          if (item.id == i.id) ref.innerText = i.title;
        });
      },
    },
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

export const viewSubtracksLoadingGrid = (item: Item): DivDefinition => ({
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
  const doneLoading = (response: LoadingItemsReponse) => {
    items.doneLoadingPage(item, response);
    const initialHeight = subtracksContainer.clientHeight;
    subtracksContainer.innerHTML = ``;
    //this is tricky. If items will be fetched during current animation, I do not need to revert animations (as if during click)
    styles.cancelAllCurrentAnimations(subtracksContainer);

    animateSubtracksContainer(subtracksContainer, item, initialHeight);
  };

  if (items.isOpenAtGallery(item) && items.isContainerNeedToFetch(item)) {
    items.startLoading(item);
    loadItemChildren(item).then(doneLoading);
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
