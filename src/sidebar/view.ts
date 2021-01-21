import { cls, dom, ClassName } from "../infra";
import { DivDefinition, EventsDefinition } from "../infra/dom";
import * as controller from "./controller";

export const viewRow = (item: Item, level: number): DivDefinition[] => {
  return [
    {
      id: rowId(item.id),
      className: [
        cls.sidebarRow,
        item.id === controller.selectedItemId
          ? cls.sidebarRowSelected
          : cls.none,
      ],
      style: {
        paddingLeft: level * 14 + "px",
      },
      attributes: {
        ["data-level"]: level + "",
      },
      on: {
        mousedown: () => controller.onItemMouseDown(item.id),
        click: () => controller.selectItem(item.id),
      },
      children: [
        {
          className: cls.sidebarRowExpandButtonContainer,
          children: chevron([
            cls.sidebarRowExpandButton,
            item.isOpenFromSidebar ? cls.rotated : cls.none,
            item.children.length == 0 ? cls.hidden : cls.none,
          ]),
          on: {
            click: (e) => {
              e.stopPropagation();
              controller.toggleSidebarVisibilityForItem(item);
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
    },
    viewChildren(item.id, level + 1),
  ];
};

export const viewChildren = (itemId: string, level: number): DivDefinition => {
  const children = controller.items[itemId].children.map(
    (id) => controller.items[id]
  );
  return {
    className: cls.sidebarRowChildrenContainer,
    children: controller.items[itemId].isOpenFromSidebar
      ? children.map((row) => viewRow(row, level)).flat()
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
