import { cls, dom, styles, anim, zIndexes } from "../infra";
import * as view from "./view";
import * as style from "./styles";
import * as gallery from "../gallery1/gallery";
import * as items from "../items";

export const init = (sidebarParent: HTMLElement) => {
  const itemsToRender = view.viewItemChildren("HOME");
  const focusContainer = dom.div({
    className: cls.sidebarFocusContainer,
    children: itemsToRender.flat(),
  });
  sidebarParent.appendChild(focusContainer);
  focusContainer.appendChild(
    dom.div({
      className: cls.sidebarPlusIcon,
      children: view.plus(cls.none),
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
    title: "",
    type: "folder",
  };
  items.appendChildTo("HOME", newItem);
  const plus = dom.findFirstByClass(cls.sidebarPlusIcon);
  const newNodes = view.viewRowAndItsChildren(newItem, 0).map(dom.div);
  plus.insertAdjacentElement("beforebegin", newNodes[0]);
  plus.insertAdjacentElement("beforebegin", newNodes[1]);
  expandRowAndChildContainer(newNodes[0], newNodes[1]);
  onEdit(newItem.id);
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
    removeFromParent(item.id);
    const cont = view.findItemChildrenContainer(item.id);
    const row = view.findRowById(item.id);
    cont.classList.add(cls.deleted);
    row.classList.add(cls.deleted);
    currentRemoveTimeouts[item.id] = setTimeout(() => {
      collapseRowAndChildContainer(row, cont, {
        doNotFadeOut: true,
      }).addEventListener("finish", () => {
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
  view.findRowById(itemId).classList.add(cls.sidebarRowSelected);
  gallery.renderItems(items.getChildren(itemId));
};

//Items expand\collapse
export const toggleSidebarVisibilityForItem = (item: ItemContainer) => {
  const level = view.parseLevelFromRow(view.findRowById(item.id));

  item.isOpenFromSidebar = !item.isOpenFromSidebar;

  const button = view.findToggleButton(item.id);

  if (item.isOpenFromSidebar) {
    button.classList.add(cls.rotated);
    showItemChildren(item, level + 1);
  } else {
    button.classList.remove(cls.rotated);
    hideItemChildren(item);
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

const showItemChildren = (item: Item, level: number) => {
  const childrenElement = view.findItemChildrenContainer(item.id);
  if (!revertAllAnimations(childrenElement)) {
    dom.set(childrenElement, view.viewItemChildren(item.id, level + 1));
    expandChildContainer(childrenElement).addEventListener("finish", () =>
      onChildrenAnimationDone(item, childrenElement)
    );
  }
};

const hideItemChildren = (item: Item) => {
  const childrenElement = view.findItemChildrenContainer(item.id);
  if (!revertAllAnimations(childrenElement)) {
    collapseChildContainer(childrenElement).addEventListener("finish", () =>
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

  items.setFocusedItem(item.id);
  const row = view.findRowById(item.id);

  focusLevel = view.parseLevelFromRow(row);
  //I'm not changing model here, thus I would be able to close item back again when unfocus
  if (!items.isOpenAtSidebar(item)) showItemChildren(item, focusLevel);

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
  items.setFocusedItem("HOME");
  dom.removeClassFromElement(cls.sidebarFocusContainerFocused);
  focusLevel = 0;
  dom.findAllByClass(cls.sidebarRowFocused).forEach((row) => {
    row.classList.remove(cls.sidebarRowFocused);
    const itemId = view.itemIdFromRow(row);
    const item = items.getItem(itemId);
    const isItemEmpty = dom.isEmpty(view.findItemChildrenContainer(itemId));
    if (!items.isOpenAtSidebar(item) && !isItemEmpty) {
      hideItemChildren(item);
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
      const row = view.findRowById(itemIdMouseDownOn);
      const childContainer = view.findItemChildrenContainer(itemIdMouseDownOn);
      collapseRowAndChildContainer(row, childContainer).addEventListener(
        "finish",
        () => {
          row.remove();
          childContainer.remove();
        }
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
      expandRowAndChildContainer(childNodes[0], childNodes[1]);
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
      .viewRowAndItsChildren(itemBeingDragged, targetItemLevel)
      .map(dom.div);
    childNodes.forEach((n) => {
      targetItemRow.insertAdjacentElement("beforebegin", n);
    });
    expandRowAndChildContainer(childNodes[0], childNodes[1]);
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
    expandRowAndChildContainer(childNodes[1], childNodes[0]);
  }
};

const collapseRowAndChildContainer = (
  row: HTMLElement,
  childContainer: HTMLElement,
  options?: anim.Options
) => {
  anim.animateHeight(row, row.clientHeight, 0, {
    duration: 60,
    fill: "forwards",
    ...options,
  });
  return anim.animateHeight(childContainer, childContainer.scrollHeight, 0, {
    duration: style.expandCollapseTransitionTime,
    fill: "forwards",
    ...options,
  });
};

const expandRowAndChildContainer = (
  row: HTMLElement,
  childContainer: HTMLElement
) => {
  console.log("expandRowAndChildContainer", row, childContainer);
  anim
    .animateHeight(row, 0, row.clientHeight, {
      duration: 60,
    })
    .addEventListener("finish", removeClassHidingChevrons);
  expandChildContainer(childContainer, {
    delay: 40,
    fill: "backwards",
  });
};

const expandChildContainer = (
  childContainer: HTMLElement,
  options?: anim.Options
) =>
  anim.animateHeight(childContainer, 0, childContainer.scrollHeight, {
    duration: style.expandCollapseTransitionTime,
    ...options,
  });

const collapseChildContainer = (
  childContainer: HTMLElement,
  options?: anim.Options
) =>
  anim.animateHeight(childContainer, childContainer.scrollHeight, 0, {
    duration: style.expandCollapseTransitionTime,
    ...options,
  });

const removeClassHidingChevrons = () => {
  dom.removeClassFromElement(cls.sidebar, cls.sidebarHideChevrons);
};
