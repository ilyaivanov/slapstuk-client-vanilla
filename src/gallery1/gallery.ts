import { cls, colors, cssClass, cssText, dom, styles, utils } from "../infra";
import * as card from "./card";
const gap = 20;

let gallery: HTMLElement;
let currentCols = 0;
let currentItems: Item[] = [];

export const rerenderIfColumnsChanged = () => {
  const colsCount = Math.round((gallery.clientWidth - gap) / (320 + gap));
  if (colsCount != currentCols) {
    currentCols = colsCount;
    const nextGallery = viewGallery();

    gallery.getAnimations().forEach((a) => a.cancel());

    const opaque: Keyframe = {
      opacity: 1,
    };
    const transparent: Keyframe = {
      opacity: 0,
    };
    const animation = gallery.animate([opaque, transparent], {
      fill: "forwards",
      duration: 100,
      easing: "ease-in",
    });

    animation.addEventListener("finish", () => {
      renderGallery(nextGallery);
      gallery.animate([transparent, opaque], {
        fill: "forwards",
        duration: 100,
        easing: "ease-out",
      });
    });
  }
};

window.addEventListener("resize", rerenderIfColumnsChanged);

export const renderItems = (itemsToRender: Item[]) => {
  gallery = dom.findFirstByClass(cls.gallery);
  currentItems = itemsToRender;
  currentCols = getColsCountFor();

  renderGallery(viewGallery());
};
const getColsCountFor = () =>
  Math.round((gallery.clientWidth - gap) / (320 + gap));

const renderGallery = (galleryContent: HTMLElement) => {
  gallery.innerHTML = "";
  gallery.appendChild(galleryContent);
};

const viewGallery = () =>
  dom.div({
    className: cls.scrolly,
    children: utils.generateNumbers(currentCols).map((rowNumber) => ({
      className: cls.column1,
      children: currentItems
        .filter((_, index) => index % currentCols == rowNumber)
        .map(card.viewCard),
    })),
  });

//Gallery
cssClass(cls.gallery, {
  backgroundColor: colors.gallery,
  position: "relative",
  overflowY: "overlay",
});

cssClass(cls.scrolly, {
  paddingTop: gap + "px",
  paddingRight: gap + "px",
  display: "flex",
  flexDirection: "row",
});

cssText(styles.cssTextForScrollBar(cls.gallery, { width: 8 }));

cssClass(cls.column1, {
  flex: "1",
  marginLeft: gap + "px",
});
