import { anim, cls, DivDefinition, dom, icons, ids, styles } from "../infra";
import * as view from "./view";
import * as style from "./styles";
import * as gallery from "../gallery1/gallery";
import * as card from "../gallery1/card";
import * as items from "../items";
import * as sidebarAnimations from "./sidebarAnimations";
import * as dnd from "../dnd/dnd";
import { LoadingItemsReponse, loadItemChildren } from "../search/controller";
import { viewItemIcon } from "./itemIcon";

export const init = (sidebarParent: HTMLElement) => {
  const itemsToRender = view.viewItemChildren("HOME");
  const focusContainer = dom.div({
    className: cls.sidebarScroll,
    children: {
      className: cls.sidebarFocusContainer,
      children: [view.viewHomeRow()].concat(itemsToRender.flat()),
    },
  });
  sidebarParent.appendChild(focusContainer);
  dom.append(sidebarParent, view.viewSidebarWidthAdjuster());
  dom.append(sidebarParent, view.viewSidebarHeader());
  if (items.focusedItemId !== "HOME") {
    //turn off container animiation during init
    const container = dom.findFirstByClass(cls.sidebarFocusContainer);
    const transition = container.style.transition;
    container.style.transition = "margin 0s linear";
    focusOnItem(items.getItem(items.focusedItemId));
    setTimeout(() => {
      container.style.transition = transition;
    }, 20);
  }
};

export const addNewItem = () => {
  const newItem: Item = {
    children: [],
    id: Math.random() + "",
    title: "",
    type: "folder",
  };
  items.prependChildTo(items.focusedItemId, newItem);
  if (items.focusedItemId == "HOME") {
    const home = dom.findById(ids.sidebarRow("HOME"));
    const newNodes = view.viewRowAndItsChildren(newItem, 0).map(dom.div);
    home.insertAdjacentElement("afterend", newNodes[1]);
    home.insertAdjacentElement("afterend", newNodes[0]);
    sidebarAnimations.expandRowAndChildContainer(newNodes[0], newNodes[1]);
    onEdit(newItem.id);
  } else {
    const focusedNode = view.findItemChildrenContainer(items.focusedItemId);
    const newNodes = view
      .viewRowAndItsChildren(newItem, focusLevel + 1)
      .map(dom.div);
    focusedNode.insertAdjacentElement("afterbegin", newNodes[1]);
    focusedNode.insertAdjacentElement("afterbegin", newNodes[0]);
    sidebarAnimations.expandRowAndChildContainer(newNodes[0], newNodes[1]);
    onEdit(newItem.id);
  }
};

export const onEdit = (itemId: string) => {
  const row = view.findRowById(itemId);
  const text = dom.findFirstByClass(cls.sidebarRowText, row);
  text.innerHTML = "";
  const finishEdit = () => {
    const newName = input.value || "New Item";
    items.getItem(itemId).title = newName;
    text.innerHTML = newName;
  };
  const input = dom.div({
    type: "input",
    className: cls.sidebarRowInputField,
    attributes: {
      value: items.getItem(itemId).title,
      draggable: "false",
      placeholder: "Enter folder name here...",
    },
    on: {
      blur: finishEdit,
      keyup: ((e: KeyboardEvent) => {
        if (e.key === "Enter") {
          input.blur();
        }
      }) as any,
      click: (e) => e.stopPropagation(),
      mousedown: (e) => e.stopPropagation(),
    },
  }) as HTMLInputElement;
  text.appendChild(input);
  input.focus();
};

var currentRemoveTimeouts: { [itemId: string]: NodeJS.Timeout } = {};
export const removeItem = (item: Item) => {
  if (currentRemoveTimeouts[item.id]) return;

  const parent = items.findParentItem(item.id);
  if (parent) {
    dnd.removeFromParent(item.id);
    const cont = view.findItemChildrenContainer(item.id);
    const row = view.findRowById(item.id);
    cont.classList.add(cls.deleted);
    row.classList.add(cls.deleted);
    currentRemoveTimeouts[item.id] = setTimeout(() => {
      sidebarAnimations
        .collapseRowAndChildContainer(row, cont, {
          doNotFadeOut: true,
        })
        .addEventListener("finish", () => {
          row.remove();
          cont.remove();
        });
      delete currentRemoveTimeouts[item.id];
    }, style.fadeOutTime);
  }
};

export const selectItem = (itemId: string) => {
  items.setSelectedItem(itemId);
  dom.removeClassFromElement(cls.sidebarRowSelected);
  dom.findFirstByClass(cls.gallery).scrollTo({ top: 0 });
  const row = dom.maybefindById(ids.sidebarRow(itemId));
  if (row) row.classList.add(cls.sidebarRowSelected);

  const item = items.getItem(itemId);
  if (items.isContainer(item) && items.isNeedsToBeLoaded(item)) {
    gallery.renderLoadingIndicator(item);
    items.startLoading(item);
    loadItemChildren(item).then((response) => {
      items.doneLoadingPage(item, response);
      gallery.renderItems(response.items);
    });
  } else {
    gallery.renderItems(items.getChildren(itemId));
  }
};

//Items expand\collapse
export const toggleSidebarVisibilityForItem = (item: ItemContainer) => {
  const itemLevel = view.parseLevelFromRow(view.findRowById(item.id));
  item.isOpenFromSidebar = !item.isOpenFromSidebar;
  const button = view.findToggleButton(item.id);
  if (items.isContainerNeedToFetch(item)) {
    const doneLoading = (response: LoadingItemsReponse) => {
      items.doneLoadingPage(item, response);
      if (items.isOpenAtSidebar(item)) {
        const childrenElement = view.findItemChildrenContainer(item.id);
        const initialHeight = childrenElement.clientHeight;
        childrenElement.innerHTML = ``;
        //this is tricky. If items will be fetched during current animation, I do not need to revert animations (as if during click)
        styles.cancelAllCurrentAnimations(childrenElement);
        showItemChildren(item, itemLevel, { initialHeight });
      }
    };

    //TODO: think about pagingation and videos hidden option here
    items.startLoading(item);
    showItemChildren(item, itemLevel);
    loadItemChildren(item).then((newItems) => doneLoading(newItems));
  } else {
    if (item.isOpenFromSidebar) {
      showItemChildren(item, itemLevel);
    } else {
      hideItemChildren(item);
    }
  }

  if (item.isOpenFromSidebar) {
    button.classList.add(cls.rotated);
  } else {
    button.classList.remove(cls.rotated);
  }
};

const revertAllAnimations = (el: HTMLElement): boolean => {
  const currentAnimations = el.getAnimations();
  if (currentAnimations.length > 0) {
    currentAnimations.forEach((a) => a.reverse());
    return true;
  } else return false;
};

const onChildrenAnimationDone = (item: Item, container: HTMLElement) => {
  if (!items.isOpenAtSidebar(item) && items.focusedItemId != item.id)
    container.innerHTML = "";
};

const showItemChildren = (
  item: Item,
  parentItemLevel: number,
  options?: anim.Options
) => {
  const childrenElement = view.findItemChildrenContainer(item.id);
  if (!revertAllAnimations(childrenElement)) {
    const content = items.isLoading(item)
      ? view.viewLoadingLabel(item, parentItemLevel)
      : view.viewItemChildren(item.id, parentItemLevel + 1);

    dom.set(childrenElement, content);
    sidebarAnimations
      .expandChildContainer(childrenElement, options)
      .addEventListener("finish", () =>
        onChildrenAnimationDone(item, childrenElement)
      );
  }
};

const hideItemChildren = (item: Item) => {
  const childrenElement = view.findItemChildrenContainer(item.id);
  if (!revertAllAnimations(childrenElement)) {
    sidebarAnimations
      .collapseChildContainer(childrenElement)
      .addEventListener("finish", () =>
        onChildrenAnimationDone(item, childrenElement)
      );
  }
};

export const toggleLeftSidebar = () => {
  setTimeout(gallery.rerenderIfColumnsChanged, style.sidebarCollapseTime);
  dom.findFirstByClass(cls.sidebar).classList.toggle(cls.sidebarHidden);
};

export const togleRightSidebar = () => {
  setTimeout(gallery.rerenderIfColumnsChanged, style.sidebarCollapseTime);
  dom
    .findFirstByClass(cls.rightSidebar)
    .classList.toggle(cls.rightSidebarHidden);
};

export let focusLevel = 0;
//Focus management
export const onCirclePressed = (item: Item) => {
  const row = view.findRowById(item.id);
  if (row.classList.contains(cls.sidebarRowFocused)) unfocus();
  else {
    // I'm not removing cls.sidebarRowFocused from DOM
    // because I'm traversing and closing all non-closed items on unfocus
    dom.removeClassFromElement(cls.sidebarRowChildrenContainerFocused);

    items.pushToFocusStack(item.id);
    focusOnItem(item);
  }
};

const focusOnItem = (item: Item) => {
  const row = view.findRowById(item.id);

  focusLevel = view.parseLevelFromRow(row);
  //I'm not changing model here, thus I would be able to close item back again when unfocus
  const container = view.findItemChildrenContainer(item.id);
  if (!items.isOpenAtSidebar(item) && dom.isEmpty(container))
    showItemChildren(item, focusLevel);

  dom.addClassToElement(
    cls.sidebarFocusContainer,
    cls.sidebarFocusContainerFocused
  );
  row.classList.add(cls.sidebarRowFocused);
  const svg = dom.findFirstByClass(cls.itemIcon, row);
  const arrowPath = icons.arrow().children as DivDefinition;
  dom.set(svg, arrowPath);
  view
    .findItemChildrenContainer(item.id)
    .classList.add(cls.sidebarRowChildrenContainerFocused);
  view.setFocusContainerNegativeMargins(
    (focusLevel + 1) * style.rowMarginPerLevel,
    row.offsetTop - style.sidebarHeaderHeight
  );
};

const setItemIcon = (item: Item, row: HTMLElement) => {
  const svg = dom.findFirstByClass(cls.itemIcon, row);
  const arrowPath = viewItemIcon(item).children as DivDefinition;
  dom.set(svg, arrowPath);
};

const unfocus = () => {
  const currentItemFocused = items.focusedItemId;
  const itemIdFocused = items.popFromFocusStack();
  if (itemIdFocused == "HOME") {
    dom.removeClassFromElement(cls.sidebarFocusContainerFocused);
    focusLevel = 0;
    dom.findAllByClass(cls.sidebarRowFocused).forEach((row) => {
      const itemId = view.itemIdFromRow(row);
      const item = items.getItem(itemId);
      row.classList.remove(cls.sidebarRowFocused);
      setItemIcon(item, row);
      const isItemEmpty = dom.isEmpty(view.findItemChildrenContainer(itemId));
      if (!items.isOpenAtSidebar(item) && !isItemEmpty) {
        hideItemChildren(item);
      }
    });

    view.setFocusContainerNegativeMargins(0, 0);
  } else {
    dom.removeClassFromElement(cls.sidebarFocusContainerFocused);
    const row = view.findRowById(currentItemFocused);
    row.classList.remove(cls.sidebarRowFocused);
    const item = items.getItem(currentItemFocused);
    setItemIcon(item, row);
    const isItemEmpty = dom.isEmpty(
      view.findItemChildrenContainer(currentItemFocused)
    );
    if (!items.isOpenAtSidebar(item) && !isItemEmpty) {
      hideItemChildren(item);
    }
    focusOnItem(items.getItem(itemIdFocused));
  }
};
