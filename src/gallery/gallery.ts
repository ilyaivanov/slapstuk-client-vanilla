import { cls, DivDefinition, dom, styles, utils } from "../infra";
import * as card from "./card";
import * as items from "../items";
import { loadItemChildren } from "../api/search";
import * as style from "./style";

let gallery: HTMLElement;
let currentCols = 0;
let currentItems: Item[] = [];

export const rerenderIfColumnsChanged = () => {
  const colsCount = Math.max(1, getColsCountFor());
  if (colsCount != currentCols) {
    currentCols = colsCount;
    renderGallery();
  }
};
const getColsCountFor = () =>
  Math.round((gallery.clientWidth - style.gap) / (320 + style.gap));

const renderGallery = () => dom.set(gallery, viewGallery());

window.addEventListener("resize", rerenderIfColumnsChanged);

export const renderItems = (itemsToRender: Item[]) => {
  gallery = dom.findFirstByClass(cls.galleryScrollyContainer);
  currentItems = itemsToRender;
  currentCols = getColsCountFor();

  galleryTransition(gallery, viewGallery());
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
    items.startLoading(item);
    showGalleryTopLoadingIndicator();
    loadItemChildren(item).then((response) => {
      items.doneLoadingPage(item, response);
      hideGalleryTopLoadingIndicator();
      renderItems(items.getChildren(items.selectedItemId));
    });
  }
};

const showGalleryTopLoadingIndicator = () =>
  dom.addClassToElement(cls.galleyTopLoading, cls.galleyTopLoadingActive);

const hideGalleryTopLoadingIndicator = () =>
  dom.removeClassFromElement(cls.galleyTopLoading, cls.galleyTopLoadingActive);

const galleryTransition = (parent: HTMLElement, nextContent: DivDefinition) => {
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

  styles.cancelAllCurrentAnimations(parent);
  const animation = parent.animate([from, toHide], {
    fill: "forwards",
    duration: 200,
    easing: "ease-in",
  });
  animation.addEventListener("finish", () => {
    dom.set(parent, nextContent);
    gallery.animate([toAppear, from], {
      fill: "forwards",
      duration: 200,
      easing: "ease-out",
    });
  });
};
