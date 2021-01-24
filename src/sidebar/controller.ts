import { cls, dom, anim, styles, zIndexes } from "../infra";
import * as view from "./view";
import * as style from "./styles";
import * as galleryController from "../gallery/controller";
import * as itemsC from "../items";

// MODEL
export let items: Items = {
  HOME: {
    id: "HOME",
    itemType: "folder",
    children: [],
    title: "Home",
  },
};
export let selectedItemId = "HOME";

export const setItems = (newItesm: Items, nodeFocused: string) => {
  items = newItesm;
  selectedItemId = nodeFocused;
};

export const init = (sidebarParent: HTMLElement) => {
  const itemsToRender = items.HOME.children.map((id) =>
    view.viewRow(items[id], 0)
  );
  sidebarParent.appendChild(
    dom.div({
      className: cls.sidebarFocusContainer,
      children: itemsToRender.flat(),
    })
  );
  //Add removeEventListener when I will have multiple pages (Login included)
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};
var currentRemoveTimeouts: { [itemId: string]: NodeJS.Timeout } = {};
export const removeItem = (item: Item) => {
  if (currentRemoveTimeouts[item.id]) return;

  const parent = Object.values(items).find(
    (v) => v.children.indexOf(item.id) >= 0
  );
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
  selectedItemId = itemId;
  dom.removeClassFromElement(cls.sidebarRowSelected);
  view.findRowById(itemId).classList.add(cls.sidebarRowSelected);
  galleryController.renderItems(items[itemId].children.map((id) => items[id]));
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
  const children = item.children
    .map((id) => view.viewRow(items[id], level + 1))
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
    if (
      !items[itemId].isOpenFromSidebar &&
      !dom.isEmpty(view.findItemChildrenContainer(itemId))
    ) {
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
      const onAnimationsDone = () => {
        dom.removeClassFromElement(cls.sidebar, cls.sidebarHideChevrons);
      };
      insertItemToLocation(
        itemIdMouseDownOn,
        targetItemId,
        destinationType,
        onAnimationsDone
      );
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
  const parent = itemsC.findParentItem(itemId);
  if (parent) parent.children = parent.children.filter((id) => id != itemId);
};

const insertItemToLocation = (
  itemBeingDraggedId: string,
  targetItemId: string,
  placement: Destination,
  onAnimationsDone: () => void
) => {
  const itemBeingDragged = items[itemBeingDraggedId];
  const targetItem = items[targetItemId];
  const targetItemRow = view.findRowById(targetItemId);
  const targetItemLevel = view.parseLevelFromRow(targetItemRow);

  if (placement == "inside") {
    targetItem.children = [itemBeingDraggedId].concat(targetItem.children);

    if (targetItem.isOpenFromSidebar) {
      const childNodes = view.viewRow(itemBeingDragged, targetItemLevel + 1);
      targetItemRow.after(dom.fragment(childNodes));
    }
    setTimeout(onAnimationsDone, style.expandCollapseTransitionTime);
  } else if (placement == "before") {
    const parent = itemsC.findParentItem(targetItemId);

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
    const [row, childContainer] = childNodes;
    anim.expandElementHeight(
      row,
      style.expandCollapseTransitionTime,
      row.clientHeight,
      onAnimationsDone
    );
    anim.expandElementHeight(
      childContainer,
      style.expandCollapseTransitionTime,
      childContainer.scrollHeight,
      onAnimationsDone
    );
  } else if (placement == "after") {
    const parent = itemsC.findParentItem(targetItemId);
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
    const [row, childContainer] = childNodes;
    anim.expandElementHeight(
      row,
      style.expandCollapseTransitionTime,
      row.clientHeight,
      onAnimationsDone
    );
    anim.expandElementHeight(
      childContainer,
      style.expandCollapseTransitionTime,
      childContainer.scrollHeight,
      onAnimationsDone
    );
  }
};
