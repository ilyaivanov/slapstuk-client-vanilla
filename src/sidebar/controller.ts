import { cls, dom, anim, styles, zIndexes } from "../infra";
import * as view from "./view";
import * as style from "./styles";
import * as galleryController from "../gallery/controller";
import * as items from "../items";

export const init = (sidebarParent: HTMLElement) => {
  const itemsToRender = items
    .getHomeItems()
    .map((item) => view.viewRow(item, 0));
  const focusContainer = dom.div({
    className: cls.sidebarFocusContainer,
    children: itemsToRender.flat(),
  });
  sidebarParent.appendChild(focusContainer);
  focusContainer.appendChild(
    dom.div({
      children: view.plus2(cls.sidebarPlusIcon),
      on: {
        click: addNewItem,
      },
    })
  );
  //Add removeEventListener when I will have multiple pages (Login included)
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

const addNewItem = () => {
  const newItem: Item = {
    children: [],
    id: Math.random() + "",
    title: "New Item",
    itemType: "folder",
  };
  items.appendChildTo("HOME", newItem);
  const plus = dom.findFirstByClass(cls.sidebarPlusIcon);
  const newNodes = view.viewRow(newItem, 0).map(dom.div);
  plus.insertAdjacentElement("beforebegin", newNodes[0]);
  plus.insertAdjacentElement("beforebegin", newNodes[1]);
  animateExpandForRowAndChildContainer(newNodes[0], newNodes[1]);
};

var currentRemoveTimeouts: { [itemId: string]: NodeJS.Timeout } = {};
export const removeItem = (item: Item) => {
  if (currentRemoveTimeouts[item.id]) return;

  const parent = items.findParentItem(item.id);
  if (parent) {
    parent.children = parent.children.filter((id) => id != item.id);
    const cont = view.findItemChildrenContainer(item.id);
    const row = view.findRowById(item.id);
    cont.classList.add(cls.deleted);
    row.classList.add(cls.deleted);
    currentRemoveTimeouts[item.id] = setTimeout(() => {
      anim.collapseElementHeight(row, style.focusTransitionTime, true);
      anim.collapseElementHeight(cont, style.focusTransitionTime, true);
      delete currentRemoveTimeouts[item.id];
    }, style.fadeOutTime);
  }
};

export const selectItem = (itemId: string) => {
  items.setSelectedItem(itemId);
  dom.removeClassFromElement(cls.sidebarRowSelected);
  view.findRowById(itemId).classList.add(cls.sidebarRowSelected);
  galleryController.renderItems(items.getChildren(itemId));
};

//Items expand\collapse
export const toggleSidebarVisibilityForItem = (item: Item) => {
  const level = view.parseLevelFromRow(view.findRowById(item.id));

  item.isOpenFromSidebar = !item.isOpenFromSidebar;

  const button = view.findToggleButton(item.id);

  if (item.isOpenFromSidebar) {
    button.classList.add(cls.rotated);
    showItemChildren(item, level);
  } else {
    button.classList.remove(cls.rotated);
    removeItemChildren(item.id);
  }
};

const showItemChildren = (item: Item, level: number) => {
  const childrenElement = view.findItemChildrenContainer(item.id);
  const children = items
    .getChildren(item.id)
    .map((item) => view.viewRow(item, level + 1))
    .flat();
  anim.openElementHeight(
    childrenElement,
    children,
    style.expandCollapseTransitionTime
  );
};

const removeItemChildren = (itemId: string) => {
  const childrenElement = view.findItemChildrenContainer(itemId);
  anim.collapseElementHeight(
    childrenElement,
    style.expandCollapseTransitionTime
  );
};

export const toggleVisibility = () => {
  dom.findFirstByClass(cls.sidebar).classList.toggle(cls.sidebarHidden);
};

let focusLevel = 0;
//Focus management
export const onCirclePressed = (item: Item) => {
  const row = view.findRowById(item.id);
  if (row.classList.contains(cls.sidebarRowFocused)) unfocus();
  else focusOnItem(item);
};

const focusOnItem = (item: Item) => {
  // I'm not removing cls.sidebarRowFocused from DOM
  // because I'm traversing and closing all non-closed items on unfocus
  dom.removeClassFromElement(cls.sidebarRowChildrenContainerFocused);

  const row = view.findRowById(item.id);

  focusLevel = view.parseLevelFromRow(row);
  //I'm not changing model here, thus I would be able to close item back again when unfocus
  if (!item.isOpenFromSidebar) showItemChildren(item, focusLevel);

  dom.addClassToElement(
    cls.sidebarFocusContainer,
    cls.sidebarFocusContainerFocused
  );
  row.classList.add(cls.sidebarRowFocused);
  view
    .findItemChildrenContainer(item.id)
    .classList.add(cls.sidebarRowChildrenContainerFocused);
  view.setFocusContainerNegativeMargins(
    parseInt(row.style.paddingLeft),
    row.offsetTop
  );
};

const unfocus = () => {
  dom.removeClassFromElement(cls.sidebarFocusContainerFocused);
  focusLevel = 0;
  dom.findAllByClass(cls.sidebarRowFocused).forEach((row) => {
    row.classList.remove(cls.sidebarRowFocused);
    const itemId = view.itemIdFromRow(row);
    const item = items.getItem(itemId);
    const isItemEmpty = dom.isEmpty(view.findItemChildrenContainer(itemId));
    if (!item.isOpenFromSidebar && !isItemEmpty) {
      removeItemChildren(itemId);
    }
  });

  view.setFocusContainerNegativeMargins(0, 0);
};

//DND
let itemIdMouseDownOn: string | undefined;
let distanceTraveledWithMouseDown = 0;
let isDragging = false;
let dragAvatar: HTMLElement | undefined;
let dragDestination: HTMLElement | undefined;
let dragAvatarX = 0;
let dragAvatarY = 0;

let targetItemId = "";
let destinationType: Destination | undefined;
type Destination = "inside" | "after" | "before";

export const onItemMouseDown = (itemId: string) => {
  dom.addClassToElement(cls.sidebar, cls.noUserSelect);
  distanceTraveledWithMouseDown = 0;
  itemIdMouseDownOn = itemId;
};

const onMouseMove = (e: MouseEvent) => {
  if (itemIdMouseDownOn) {
    distanceTraveledWithMouseDown += Math.sqrt(
      e.movementX * e.movementX + e.movementY * e.movementY
    );
    if (distanceTraveledWithMouseDown > 3 && !isDragging) {
      startDrag(itemIdMouseDownOn);
    } else if (isDragging && dragAvatar && dragDestination) {
      onMouseMoveDuringDrag(dragAvatar, dragDestination, e);
    }
  }
};

const startDrag = (itemId: string) => {
  dom.addClassToElement(cls.page, cls.grabbing);
  dom.addClassToElement(cls.sidebar, cls.sidebarHideChevrons);
  view
    .findItemChildrenContainer(itemId)
    .classList.add(cls.sidebarRowChildrenContainerHighlighted);
  const originalRow = view.findRowById(itemId);
  const row = originalRow.cloneNode(true);
  originalRow.classList.add(cls.transparent);
  var rect = originalRow.getBoundingClientRect();
  dragAvatar = dom.div({
    className: cls.dragAvatar,
    style: {
      ...styles.absoluteTopLeft(rect.top, rect.left),
      width: rect.width + "px",
      height: rect.height + "px",
      zIndex: zIndexes.dragAvatar,
    },
  });
  dragDestination = dom.div({
    id: "drag-destination",
    style: {
      backgroundColor: "#03a9f4",
      position: "absolute",
      height: "4px",
      zIndex: zIndexes.dragDestinationIndicator,
    },
  });
  dragAvatar.appendChild(row);
  dom.findById("root").appendChild(dragAvatar);
  dom.findById("root").appendChild(dragDestination);
  dragAvatarX = rect.left;
  dragAvatarY = rect.top;
  isDragging = true;
};

const onMouseMoveDuringDrag = (
  dragAvatar: HTMLElement,
  dragDestination: HTMLElement,
  e: MouseEvent
) => {
  dragAvatarX += e.movementX;
  dragAvatarY += e.movementY;
  dragAvatar.style.setProperty("left", dragAvatarX + "px");
  dragAvatar.style.setProperty("top", dragAvatarY + "px");
  const potentialRowUnder = document
    .elementsFromPoint(e.clientX, e.clientY)
    .filter((x) => x.classList.contains(cls.sidebarRow));

  if (potentialRowUnder.length > 0) {
    const rowUnder = potentialRowUnder[0] as HTMLElement;
    targetItemId = view.itemIdFromRow(rowUnder);
    const rect = rowUnder.getBoundingClientRect();
    const isOnTheSecondHalf = e.clientY >= rect.top + rect.height / 2;
    if (isOnTheSecondHalf) {
      destinationType = "after";
      dragDestination.style.top = rect.bottom - 2 + "px";
    } else {
      destinationType = "before";
      dragDestination.style.top = rect.top - 2 + "px";
    }
    const iconsWidth = 16;
    const focusShift = focusLevel * style.rowMarginPerLevel;
    const elementLeft =
      parseInt(rowUnder.style.paddingLeft) + iconsWidth - focusShift;
    const isInside =
      e.clientX > elementLeft + style.rowMarginPerLevel && isOnTheSecondHalf;
    const left = isInside ? elementLeft + style.rowMarginPerLevel : elementLeft;
    if (isInside) destinationType = "inside";
    dragDestination.style.left = left + "px";

    dragDestination.style.width = rect.width - left + "px";
  } else {
    dragDestination.style.width = "0px";
  }
  document.elementsFromPoint;
};

const onMouseUp = () => {
  if (itemIdMouseDownOn && isDragging) {
    if (targetItemId && destinationType) {
      anim.collapseElementHeight(
        view.findRowById(itemIdMouseDownOn),
        style.expandCollapseTransitionTime,
        true
      );
      anim.collapseElementHeight(
        view.findItemChildrenContainer(itemIdMouseDownOn),
        style.expandCollapseTransitionTime,
        true
      );
      removeFromParent(itemIdMouseDownOn);
      insertItemToLocation(itemIdMouseDownOn, targetItemId, destinationType);
    }

    var originalRow = view.findRowById(itemIdMouseDownOn);
    dom.removeClassFromElement(cls.page, cls.grabbing);
    view
      .findItemChildrenContainer(itemIdMouseDownOn)
      .classList.remove(cls.sidebarRowChildrenContainerHighlighted);
    originalRow.classList.remove(cls.transparent);
    dom.findFirstByClass(cls.dragAvatar).remove();
    dom.findById("drag-destination").remove();
  }
  dragAvatar = undefined;
  dragDestination = undefined;
  isDragging = false;
  itemIdMouseDownOn = undefined;
  targetItemId = "";
  destinationType = undefined;
};

const removeFromParent = (itemId: string) => {
  const parent = items.findParentItem(itemId);
  if (parent) parent.children = parent.children.filter((id) => id != itemId);
};

const insertItemToLocation = (
  itemBeingDraggedId: string,
  targetItemId: string,
  placement: Destination
) => {
  const itemBeingDragged = items.getItem(itemBeingDraggedId);
  const targetItem = items.getItem(targetItemId);
  const targetItemRow = view.findRowById(targetItemId);
  const targetItemLevel = view.parseLevelFromRow(targetItemRow);

  if (placement == "inside") {
    targetItem.children = [itemBeingDraggedId].concat(targetItem.children);

    if (targetItem.isOpenFromSidebar) {
      const childNodes = view
        .viewRow(itemBeingDragged, targetItemLevel + 1)
        .map(dom.div);
      const container = view.findItemChildrenContainer(targetItemId);
      container.insertAdjacentElement("afterbegin", childNodes[1]);
      container.insertAdjacentElement("afterbegin", childNodes[0]);
      animateExpandForRowAndChildContainer(childNodes[0], childNodes[1]);
    } else removeClassHidingChevrons();
  } else if (placement == "before") {
    const parent = items.findParentItem(targetItemId);

    if (parent) {
      parent.children = parent.children
        .map((id) => (id == targetItemId ? [itemBeingDraggedId, id] : id))
        .flat();
    } else {
      throw new Error(
        `No parent found for item id ${targetItemId} (title: ${targetItem.title})`
      );
    }
    const childNodes = view
      .viewRow(itemBeingDragged, targetItemLevel)
      .map(dom.div);
    childNodes.forEach((n) => {
      targetItemRow.insertAdjacentElement("beforebegin", n);
    });
    animateExpandForRowAndChildContainer(childNodes[0], childNodes[1]);
  } else if (placement == "after") {
    const parent = items.findParentItem(targetItemId);
    if (parent) {
      parent.children = parent.children
        .map((id) => (id == targetItemId ? [id, itemBeingDraggedId] : id))
        .flat();
    } else {
      throw new Error(
        `No parent found for item id ${targetItemId} (title: ${targetItem.title})`
      );
    }
    const childNodes = view
      .viewRow(itemBeingDragged, targetItemLevel)
      .reverse()
      .map(dom.div);
    const targetItemChildContainer = view.findItemChildrenContainer(
      targetItemId
    );
    childNodes.forEach((n) =>
      targetItemChildContainer.insertAdjacentElement("afterend", n)
    );
    animateExpandForRowAndChildContainer(childNodes[0], childNodes[1]);
  }
};

const animateExpandForRowAndChildContainer = (
  row: HTMLElement,
  childContainer: HTMLElement
) => {
  //TODO: onAnimationsDone is triggered twice. need to think about race conditions here
  anim.expandElementHeight(
    row,
    style.expandCollapseTransitionTime,
    row.clientHeight,
    removeClassHidingChevrons
  );
  anim.expandElementHeight(
    childContainer,
    style.expandCollapseTransitionTime,
    childContainer.scrollHeight,
    removeClassHidingChevrons
  );
};

const removeClassHidingChevrons = () =>
  dom.removeClassFromElement(cls.sidebar, cls.sidebarHideChevrons);
