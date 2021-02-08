import {
  cls,
  dom,
  ClassName,
  DivDefinition,
  EventsDefinition,
  utils,
  icons,
  ids,
} from "../infra";
import * as controller from "./controller";
import * as style from "./styles";
import * as galleryStyle from "../gallery1/style";
import * as items from "../items";
import * as app from "../app";
import * as dnd from "../dnd/dnd";
import { viewItemIcon } from "./itemIcon";

export const viewItemChildren = (itemId: string, initialLevel = 0) =>
  items
    .getChildren(itemId)
    .map((item) => viewRowAndItsChildren(item, initialLevel))
    .flat();

export const viewRowAndItsChildren = (
  item: Item,
  level: number
): DivDefinition[] => {
  return [viewRow(item, level), viewChildren(item, level + 1)];
};
export const viewRow = (item: Item, level: number): DivDefinition => ({
  id: rowId(item.id),
  className: [
    cls.sidebarRow,
    item.id === items.selectedItemId ? cls.sidebarRowSelected : cls.none,
  ],
  style: {
    paddingLeft: level * style.rowMarginPerLevel + "px",
  },
  attributes: {
    title: item.title,
    ["data-level"]: level + "",
  },
  on: {
    mousedown: () => dnd.onItemMouseDown(item.id, "sidebar-row"),
    click: () => controller.selectItem(item.id),
  },
  children: [
    {
      className: [
        cls.sidebarRowExpandButtonContainer,
        items.isVideo(item) ||
        (items.isFolder(item) && !items.hasChildren(item))
          ? cls.hidden
          : cls.none,
      ],
      children: icons.chevron([
        cls.sidebarRowExpandButton,
        items.isOpenAtSidebar(item) ? cls.rotated : cls.none,
      ]),
      on: {
        click: (e) => {
          console.log("chevron clicked", item.title);
          e.stopPropagation();
          controller.toggleSidebarVisibilityForItem(item as ItemContainer);
        },
      },
    },
    viewItemIcon(item),
    {
      className: cls.sidebarRowText,
      children: item.title,
    },
    {
      className: cls.sidebarIconsContainer,
      children: [
        {
          children: icons.edit(cls.sidebarIcon),
          on: {
            click: (e) => {
              e.stopPropagation();
              controller.onEdit(item.id);
            },
          },
        },
        {
          children: icons.cross([cls.sidebarIcon, cls.sidebarIconDelete]),
          on: {
            click: (e) => {
              e.stopPropagation();
              controller.removeItem(item);
            },
          },
        },
      ],
    },
  ],
});

export const viewHomeRow = (): DivDefinition => ({
  id: rowId("HOME"),
  className: [
    cls.sidebarRow,
    "HOME" === items.selectedItemId ? cls.sidebarRowSelected : cls.none,
  ],
  style: {
    paddingLeft: 18,
  },
  attributes: {
    ["data-level"]: "0",
  },
  on: {
    click: () => controller.selectItem("HOME"),
  },
  children: [
    {
      style: { fontSize: 22 },
      className: cls.sidebarRowText,
      children: items.getItem("HOME").title,
    },
  ],
});

export const viewChildren = (item: Item, level: number): DivDefinition => {
  const children = items.getChildren(item.id);
  return {
    className: cls.sidebarRowChildrenContainer,
    children: items.isOpenAtSidebar(item)
      ? children.map((row) => viewRowAndItsChildren(row, level)).flat()
      : [],
  };
};

export const viewLoadingLabel = (item: Item, parentItemLevel: number) => ({
  style: {
    paddingLeft: (parentItemLevel + 3) * style.rowMarginPerLevel,
    fontStyle: "italic",
    color: galleryStyle.getItemColor(item),
  },
  children: "Loading...",
});

export const rowId = (itemId: string) => `row-${itemId}`;
export const itemIdFromRow = (row: HTMLElement) => row.id.substr(4);

export const findRowById = (itemId: string) => dom.findById(rowId(itemId));

export const findToggleButton = (itemId: string) => {
  return dom.findFirstByClass(cls.sidebarRowExpandButton, findRowById(itemId));
};

export const findFocusButton = (row: HTMLElement) => {
  return dom.findFirstByClass(cls.sidebarRowCircle, row);
};

export const updateItemChevron = (item: Item) => {
  const row = dom.maybefindById(rowId(item.id));
  if (row) {
    const chevronContainer = dom.findFirstByClass(
      cls.sidebarRowExpandButtonContainer,
      row
    );
    if (items.hasChildren(item)) chevronContainer.classList.remove(cls.hidden);
    else chevronContainer.classList.add(cls.hidden);
  }
};

export const findFocusButtonForItem = (itemId: string) => {
  const row = dom.findById(rowId(itemId));
  return findFocusButton(row);
};

export const findItemChildrenContainer = (itemId: string): HTMLElement => {
  return findRowById(itemId).nextSibling as HTMLElement;
};

export const setFocusContainerNegativeMargins = (left: number, top: number) => {
  const s = dom.findFirstByClass(cls.sidebarFocusContainer);
  s.style.marginLeft = -left + "px";
  s.style.marginTop = -top + "px";
};

export const parseLevelFromRow = (row: HTMLElement): number => {
  const levelStr = row.getAttribute("data-level");
  if (!levelStr) {
    console.error(row);
    throw Error(`No data-level attribute found on item.`);
  }
  return parseInt(levelStr);
};

export const viewSidebarHeader = (): DivDefinition => ({
  className: cls.sidebarHeader,
  children: [
    {
      attributes: { title: "Coolapse all nodes" },
      children: icons.minusSquare(cls.sidebarHeaderIcon),
    },
    {
      attributes: { title: "Hide all videos from sidebar" },
      children: icons.hideVideo(cls.sidebarHeaderIcon),
    },
    {
      attributes: { title: "Create new folder" },
      children: icons.folderPlus(cls.sidebarHeaderIcon),
      on: {
        click: controller.addNewItem,
      },
    },
  ],
});

export const viewSidebarWidthAdjuster = (): DivDefinition => ({
  className: cls.sidebarWidthAdjuster,
  on: {
    mousedown: dnd.onSidebarWidthAdjusterMouseDown,
    dblclick: () => {
      const rowFocused = dom.findById(ids.sidebarRow(items.focusedItemId));
      const focusedRowText = dom.findFirstByClass(
        cls.sidebarRowText,
        rowFocused
      );
      const children =
        items.focusedItemId === "HOME"
          ? dom.findFirstByClass(cls.sidebar)
          : findItemChildrenContainer(items.focusedItemId);
      const childrenTexts = dom.findAllByClass(cls.sidebarRowText, children);
      const maxWidth = utils.max(
        childrenTexts.concat([focusedRowText]).map((r) => {
          const rect = r.getBoundingClientRect();
          return rect.x + rect.width;
        })
      );
      if (maxWidth) app.setLeftSidebarWidth(maxWidth + 10);
    },
  },
});
