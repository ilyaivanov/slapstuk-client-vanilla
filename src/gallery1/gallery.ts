import { cls, dom, styles, utils } from "../infra";
import * as card from "./card";
const gap = 20;

let gallery: HTMLElement;
let currentCols = 0;
let currentItems: Item[] = [];

export const rerenderIfColumnsChanged = () => {
  const colsCount = Math.max(
    1,
    Math.round((gallery.clientWidth - gap) / (320 + gap))
  );
  if (colsCount != currentCols) {
    currentCols = colsCount;
    dom.set(gallery, viewGallery());
  }
};

window.addEventListener("resize", rerenderIfColumnsChanged);

export const renderItems = (itemsToRender: Item[]) => {
  gallery = dom.findFirstByClass(cls.gallery);
  currentItems = itemsToRender;
  currentCols = getColsCountFor();

  dom.set(gallery, viewGallery());
};

export const renderLoadingIndicator = (item: Item) => {
  dom.set(gallery, {
    style: {
      ...styles.flexCenter,
      height: "100%",
    },
    children: card.viewSubtracksLoadingGrid(item),
  });
};
const getColsCountFor = () =>
  Math.round((gallery.clientWidth - gap) / (320 + gap));

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
