import { cls, dom, styles, zIndexes } from "../infra";
import * as view from "../sidebar/view";
import * as style from "../sidebar/styles";
import * as sidebar from "../sidebar/controller";
import * as sidebarAnimations from "../sidebar/sidebarAnimations";
import * as items from "../items";

export const init = () => {
  //Add removeEventListener when I will have multiple pages (Login included)
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
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
type Destination = "inside" | "after" | "before";

export const onItemMouseDown = (itemId: string) => {
  dom.addClassToElement(cls.sidebar, cls.noUserSelect);
  distanceTraveledWithMouseDown = 0;
  itemIdMouseDownOn = itemId;
};

function onMouseMove(e: MouseEvent) {
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
}

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
      transition: "all 100ms ease-out",
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
    const focusShift = sidebar.focusLevel * style.rowMarginPerLevel;
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

function onMouseUp() {
  if (itemIdMouseDownOn && isDragging) {
    if (targetItemId && destinationType) {
      const row = view.findRowById(itemIdMouseDownOn);
      const childContainer = view.findItemChildrenContainer(itemIdMouseDownOn);
      sidebarAnimations
        .collapseRowAndChildContainer(row, childContainer)
        .addEventListener("finish", () => {
          row.remove();
          childContainer.remove();
        });
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
