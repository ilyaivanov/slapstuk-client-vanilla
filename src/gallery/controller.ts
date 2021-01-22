import { anim, cls, dom, ids } from "../infra";
import { DivDefinition } from "../infra/dom";
import * as style from "./style";
import * as sidebarController from "../sidebar/controller";
import * as player from "../player/controller";

let items: Item[] = [];
export const renderItems = (newItems: Item[]) => {
  const gallery = dom.findFirstByClass(cls.gallery);
  items = newItems;
  const preparedViews = dom.fragment(items.map(viewCard));

  if (!dom.isEmpty(gallery)) {
    //extract this to a crossfade animation
    const from: Keyframe = {
      opacity: 1,
      transform: "translateX(0px)",
    };
    const toHide: Keyframe = {
      opacity: 0,
      transform: "translateX(-20px)",
    };
    const toAppear: Keyframe = {
      opacity: 0,
      transform: "translateX(20px)",
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
  const card = dom.findById("card-" + item.id);
  item.isOpenInGallery = !item.isOpenInGallery;
  const cardImage = dom.findFirstByClass(cls.cardImage, card);
  const cardSubtracksContainer = dom.findFirstByClass(
    cls.subtracksContainer,
    card
  );
  if (item.isOpenInGallery) {
    cardImage.classList.add(cls.cardImageHidden);
    const gallery = dom.findFirstByClass(cls.gallery);
    anim.openElementHeight(
      cardSubtracksContainer,
      viewSubtracks(item.id),
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
  on: {
    click: () => {
      if (item.itemType == "video") player.playItem(item.id);
      else toggleCardExpandCollapse(item);
    },
  },
  children: [
    {
      className: cls.cardImageWithTextContainer,
      children: [
        {
          type: "img",
          className: [
            cls.cardImage,
            item.isOpenInGallery ? cls.cardImageHidden : cls.none,
          ],
          attributes: {
            src: getImageSrc(item) || defaultSrc,
            draggable: "false",
          },
        },
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
  ],
});

const viewSubtracks = (itemId: string) =>
  sidebarController.items[itemId].children
    .map((id) => sidebarController.items[id])
    .map(viewSubtrack);

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
      attributes: { src: getImageSrc(item) },
    },
    { type: "span", children: item.title },
  ],
});

const defaultSrc = "https://i.ytimg.com/vi/84Xpdw92KFo/mqdefault.jpg";
const getImageSrc = (item: Item): string | undefined => {
  if (item.image) return item.image;
  else if (item.videoId)
    return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
  else return undefined;
};

const l = (e: any) => {
  console.log(e);
  return e;
};
