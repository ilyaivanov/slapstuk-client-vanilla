import { cls, dom } from "../infra";
import { DivDefinition } from "../infra/dom";
import * as style from "./style";

let items: Item[] = [];
export const renderItems = (newItems: Item[]) => {
  const gallery = dom.findFirstByClass(cls.gallery);
  items = newItems;
  const preparedViews = dom.fragment(items.map(viewCard));

  if (!dom.isEmpty(gallery)) {
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

//VIEW
const viewCard = (item: Item): DivDefinition => ({
  className: cls.card,
  children: [
    {
      type: "img",
      className: cls.cardImage,
      attributes: { src: getImageSrc(item), draggable: "false" },
    },
    {
      className: cls.cardText,
      children: item.title,
    },
  ],
});

const getImageSrc = (item: Item): string | undefined => {
  if (item.image) return item.image;
  else if (item.videoId)
    return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
  else return undefined;
};

const log = (val: any) => {
  console.log("foo", val);
  return val;
};
