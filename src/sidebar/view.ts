import { cls, dom, ClassName, DivDefinition, EventsDefinition } from "../infra";
import * as controller from "./controller";
import * as style from "./styles";
import * as items from "../items";
import * as dnd from "../dnd/dnd";

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
        items.hasChildren(item) ? cls.none : cls.hidden,
      ],
      children: chevron([
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
    arrow(cls.sidebarRowCircle, {
      click: (e) => {
        e.stopPropagation();
        controller.onCirclePressed(item);
      },
    }),
    {
      className: cls.sidebarRowText,
      children: item.title,
    },
    {
      className: cls.sidebarEditItemButton,
      children: "e",
      on: {
        click: (e) => {
          e.stopPropagation();
          controller.onEdit(item.id);
        },
      },
    },
    {
      className: cls.sidebarRemoveItemButton,
      children: "x",
      on: {
        click: (e) => {
          e.stopPropagation();
          controller.removeItem(item);
        },
      },
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

//ICONS
const chevron = (className?: ClassName | ClassName[]): DivDefinition =>
  svgPath(
    "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z",
    "0 0 256 512",
    className
  );

export const arrow = (
  className?: ClassName | ClassName[],
  on?: EventsDefinition
): DivDefinition =>
  svgPath(
    "M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z",
    "0 0 448 512",
    className,
    on
  );

export const plus = (className?: ClassName | ClassName[]) =>
  svgPath(
    "m405.332031 192h-170.664062v-170.667969c0-11.773437-9.558594-21.332031-21.335938-21.332031-11.773437 0-21.332031 9.558594-21.332031 21.332031v170.667969h-170.667969c-11.773437 0-21.332031 9.558594-21.332031 21.332031 0 11.777344 9.558594 21.335938 21.332031 21.335938h170.667969v170.664062c0 11.777344 9.558594 21.335938 21.332031 21.335938 11.777344 0 21.335938-9.558594 21.335938-21.335938v-170.664062h170.664062c11.777344 0 21.335938-9.558594 21.335938-21.335938 0-11.773437-9.558594-21.332031-21.335938-21.332031zm0 0",
    "0 0 426.66667 426.66667",
    className
  );

//UTILS

const svgPath = (
  path: string,
  viewBox: string,
  className?: ClassName | ClassName[],
  on?: dom.EventsDefinition
): DivDefinition => ({
  type: "svg",
  className,
  attributes: {
    viewBox,
  },
  on,
  children: {
    type: "path",
    attributes: {
      fill: "currentColor",
      d: path,
    },
  },
});
