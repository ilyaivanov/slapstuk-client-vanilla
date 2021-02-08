import { cls, dom, ids, styles, zIndexes } from "../infra";
import * as view from "../sidebar/view";
import * as sidebarStyles from "../sidebar/styles";
import * as sidebar from "../sidebar/controller";
import * as sidebarAnimations from "../sidebar/sidebarAnimations";
import * as items from "../items";
import { getPreviewImage } from "../gallery1/cardPreviewImage";
import * as app from "../app";

export const init = () => {
  //Add removeEventListener when I will have multiple pages (Login included)
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
};

let isCtrlDown = false;
const onKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey) {
    isCtrlDown = true;
    dom.findById(ids.root).classList.add(cls.ctrlKeyPressed);
  }
};

const onKeyUp = (e: KeyboardEvent) => {
  if (isCtrlDown && !e.ctrlKey) {
    isCtrlDown = false;
    dom.findById(ids.root).classList.remove(cls.ctrlKeyPressed);
  }
};

let itemIdMouseDownOn: string | undefined;
let distanceTraveledWithMouseDown = 0;
let isDragging = false;
let dragAvatar: HTMLElement | undefined;
let dragDestination: HTMLElement | undefined;
let dragAvatarX = 0;
let dragAvatarY = 0;

let targetItemId = "";
let destinationType: Destination | undefined;
let currentDragArea: DragItemType | undefined;
type Destination = "inside" | "after" | "before";
type DragItemType = "sidebar-row" | "gallery-card" | "card-subtrack";

export const onItemMouseDown = (itemId: string, source: DragItemType) => {
  dom.addClassToElement(cls.page, cls.noUserSelect);
  distanceTraveledWithMouseDown = 0;
  itemIdMouseDownOn = itemId;
  currentDragArea = source;
};

//Sidebar Width adjuster
let isMouseDownOnAdjuster = false;
export const onSidebarWidthAdjusterMouseDown = () => {
  console.log("onSidebarWidthAdjusterMouseDown");
  dom.addClassToElement(cls.page, cls.noUserSelect);
  isMouseDownOnAdjuster = true;
};

function onMouseMove(e: MouseEvent) {
  if (isMouseDownOnAdjuster) {
    app.setLeftSidebarWidth(e.clientX);
  } else if (itemIdMouseDownOn) {
    distanceTraveledWithMouseDown += Math.sqrt(
      e.movementX * e.movementX + e.movementY * e.movementY
    );
    if (distanceTraveledWithMouseDown > 3 && !isDragging) {
      startDrag(itemIdMouseDownOn, e);
    } else if (isDragging && dragAvatar && dragDestination) {
      onMouseMoveDuringDrag(dragAvatar, dragDestination, e);
    }
  }
}
const getElementBeingDragged = (itemId: string): HTMLElement =>
  dom.div(getPreviewImage(items.getItem(itemId)));

const startDrag = (itemId: string, e: MouseEvent) => {
  dom.addClassToElement(cls.page, cls.grabbing);
  dom.addClassToElement(cls.sidebar, cls.sidebarHideChevrons);
  dragAvatarX = e.clientX - 104 / 2;
  dragAvatarY = e.clientY - 104 / 1.5;
  console.log(dragAvatarX, dragAvatarY);
  dragAvatar = dom.div({
    className: cls.dragAvatar,
    style: {
      ...styles.absoluteTopLeft(dragAvatarY, dragAvatarX),
      width: 104,
      height: 104,
      zIndex: zIndexes.dragAvatar,
      opacity: 0.6,
      borderRadius: 4,
      overflow: "hidden",
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
  dragAvatar.appendChild(getElementBeingDragged(itemId));

  dom.findById("root").appendChild(dragAvatar);
  dom.findById("root").appendChild(dragDestination);
  isDragging = true;
};

const onMouseMoveDuringDrag = (
  dragAvatar: HTMLElement,
  dragDestination: HTMLElement,
  e: MouseEvent
) => {
  dragAvatarX += e.movementX;
  dragAvatarY += e.movementY;
  console.log(dragAvatarX, dragAvatarY);
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
    const focusShift = sidebar.focusLevel * sidebarStyles.rowMarginPerLevel;
    const elementLeft =
      parseInt(rowUnder.style.paddingLeft) + iconsWidth - focusShift;
    const isInside =
      e.clientX > elementLeft + sidebarStyles.rowMarginPerLevel &&
      isOnTheSecondHalf &&
      items.isContainer(items.getItem(targetItemId));
    const left = isInside
      ? elementLeft + sidebarStyles.rowMarginPerLevel
      : elementLeft;
    if (isInside) destinationType = "inside";
    dragDestination.style.left = left + "px";

    dragDestination.style.width = rect.width - left + "px";
  } else {
    dragDestination.style.width = "0px";
    destinationType = undefined;
  }
  document.elementsFromPoint;
};

function onMouseUp() {
  if (itemIdMouseDownOn && isDragging) {
    if (targetItemId && destinationType) {
      console.log(targetItemId, destinationType);
      const row = dom.maybefindById(ids.sidebarRow(itemIdMouseDownOn));
      if (row) {
        const childContainer = view.findItemChildrenContainer(
          itemIdMouseDownOn
        );
        sidebarAnimations
          .collapseRowAndChildContainer(row, childContainer)
          .addEventListener("finish", () => {
            row.remove();
            childContainer.remove();
          });
      }
      removeFromParent(itemIdMouseDownOn);
      insertItemToLocation(itemIdMouseDownOn, targetItemId, destinationType);
    } else {
      sidebarAnimations.removeClassHidingChevrons();
    }

    var originalRow = getElementBeingDragged(itemIdMouseDownOn);
    dom.removeClassFromElement(cls.page, cls.grabbing);
    if (currentDragArea == "sidebar-row") {
      view
        .findItemChildrenContainer(itemIdMouseDownOn)
        .classList.remove(cls.sidebarRowChildrenContainerHighlighted);
    }
    originalRow.classList.remove(cls.transparent);
    dom.findFirstByClass(cls.dragAvatar).remove();
    dom.findById("drag-destination").remove();
  }

  dom.removeClassFromElement(cls.page, cls.noUserSelect);
  dragAvatar = undefined;
  dragDestination = undefined;
  isDragging = false;
  itemIdMouseDownOn = undefined;
  targetItemId = "";
  destinationType = undefined;
  isMouseDownOnAdjuster = false;
}

export const removeFromParent = (itemId: string) => {
  const parent = items.findParentItem(itemId);
  if (parent && items.isContainer(parent)) {
    setChildren(
      parent,
      items
        .getChildren(parent.id)
        .map((c) => c.id)
        .filter((id) => id != itemId)
    );
  }
};

//update functions
const setChildren = (item: ItemContainer, children: string[]) => {
  item.children = children;
  if (item.id !== "HOME") view.updateItemChevron(item);
};

const insertItemToLocation = (
  itemBeingDraggedId: string,
  targetItemId: string,
  placement: Destination
) => {
  const itemBeingDragged = items.getItem(itemBeingDraggedId);
  const targetItem = items.getItem(targetItemId) as ItemContainer;
  const targetItemRow = view.findRowById(targetItemId);
  const targetItemLevel = view.parseLevelFromRow(targetItemRow);

  if (placement == "inside") {
    setChildren(targetItem, [itemBeingDraggedId].concat(targetItem.children));

    if (targetItem.isOpenFromSidebar) {
      const childNodes = view
        .viewRowAndItsChildren(itemBeingDragged, targetItemLevel + 1)
        .map(dom.div);
      const container = view.findItemChildrenContainer(targetItemId);
      container.insertAdjacentElement("afterbegin", childNodes[1]);
      container.insertAdjacentElement("afterbegin", childNodes[0]);
      sidebarAnimations.expandRowAndChildContainer(
        childNodes[0],
        childNodes[1]
      );
    } else sidebarAnimations.removeClassHidingChevrons();
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
      .viewRowAndItsChildren(itemBeingDragged, targetItemLevel)
      .map(dom.div);
    childNodes.forEach((n) => {
      targetItemRow.insertAdjacentElement("beforebegin", n);
    });
    sidebarAnimations.expandRowAndChildContainer(childNodes[0], childNodes[1]);
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
      .viewRowAndItsChildren(itemBeingDragged, targetItemLevel)
      .reverse()
      .map(dom.div);
    const targetItemChildContainer = view.findItemChildrenContainer(
      targetItemId
    );
    childNodes.forEach((n) =>
      targetItemChildContainer.insertAdjacentElement("afterend", n)
    );
    sidebarAnimations.expandRowAndChildContainer(childNodes[1], childNodes[0]);
  }
};
