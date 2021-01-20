import { cls, dom, anim } from "../infra";
import { startItems } from "../items";
import * as view from "./view";
import * as style from "./styles";

// MODEL
export const items: Items = startItems;

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
};

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

  //I'm not changing model here, thus I would be able to close item back again when unfocus
  if (!item.isOpenFromSidebar)
    showItemChildren(item, view.parseLevelFromRow(row));

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
  dom.findAllByClass(cls.sidebarRowFocused).forEach((row) => {
    row.classList.remove(cls.sidebarRowFocused);
    const itemId = row.id.substr(4);
    if (
      !items[itemId].isOpenFromSidebar &&
      !dom.isEmpty(view.findItemChildrenContainer(itemId))
    ) {
      removeItemChildren(itemId);
    }
  });

  view.setFocusContainerNegativeMargins(0, 0);
};
