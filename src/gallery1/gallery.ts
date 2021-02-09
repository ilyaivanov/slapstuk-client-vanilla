import { cls, dom, styles, utils } from "../infra";
import * as card from "./card";
import * as items from "../items";
import { loadItemChildren } from "../search/controller";
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
    renderGallery();
  }
};

const renderGallery = () => dom.set(gallery, viewGallery());

window.addEventListener("resize", rerenderIfColumnsChanged);

export const renderItems = (itemsToRender: Item[]) => {
  gallery = dom.findFirstByClass(cls.galleryScrollyContainer);
  currentItems = itemsToRender;
  currentCols = getColsCountFor();

  renderGallery();
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

const viewGallery = () => ({
  className: cls.scrolly,

  children: utils.generateNumbers(currentCols).map((rowNumber) => ({
    className: cls.column1,
    children: currentItems
      .filter((_, index) => index % currentCols == rowNumber)
      .map(card.viewCard),
  })),
});

export const onGalleryScroll = (e: MouseEvent) => {
  const node = e.currentTarget as HTMLElement;
  const item = items.getItem(items.selectedItemId);
  const distanceFromBottom =
    node.scrollHeight - node.scrollTop - node.offsetHeight;
  if (distanceFromBottom < 5 && items.needToLoadNextPage(item)) {
    console.log("Starting to load ", item);
    items.startLoading(item);
    showGalleryTopLoadingIndicator();
    //view some loader
    loadItemChildren(item).then((response) => {
      items.doneLoadingPage(item, response);
      hideGalleryTopLoadingIndicator();
      console.log("doneLoadingPage", item, response);
      renderItems(items.getChildren(items.selectedItemId));
      // remove that loader
    });
  }
};

const showGalleryTopLoadingIndicator = () =>
  dom.addClassToElement(cls.galleyTopLoading, cls.galleyTopLoadingActive);

const hideGalleryTopLoadingIndicator = () =>
  dom.removeClassFromElement(cls.galleyTopLoading, cls.galleyTopLoadingActive);
