import { cls, dom, ClassName } from "../infra";
import { DivDefinition } from "../infra/dom";
import * as controller from "./controller";

export const viewRow = (item: Item, level: number): DivDefinition[] => {
  return [
    {
      id: rowId(item.id),
      className: cls.sidebarRow,
      style: {
        paddingLeft: level * 14 + "px",
      },
      attributes: {
        ["data-level"]: level + "",
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
            click: () => controller.toggleSidebarVisibilityForItem(item),
          },
        },
        {
          className: cls.sidebarRowCircle,
          on: {
            click: () => controller.focusOnItem(item),
          },
        },
        {
          className: cls.sidebarRowText,
          children: item.title,
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
export const viewUnfocusButton = (): DivDefinition => ({
  className: cls.unfocusButton,
  type: "button",
  children: "unfocus",
  on: {
    click: controller.unfocus,
  },
});

export const rowId = (itemId: string) => `row-${itemId}`;

export const findRowById = (itemId: string) => dom.findById(rowId(itemId));

export const findToggleButton = (itemId: string) => {
  return dom.findFirstByClass(cls.sidebarRowExpandButton, findRowById(itemId));
};
export const findItemChildrenContainer = (itemId: string): HTMLElement => {
  return findRowById(itemId).nextSibling as HTMLElement;
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
//UTILS

const svgPath = (
  path: string,
  viewBox: string,
  className?: ClassName | ClassName[]
): DivDefinition => ({
  type: "svg",
  className,
  attributes: {
    viewBox,
  },
  children: {
    type: "path",
    attributes: {
      fill: "currentColor",
      d: path,
    },
  },
});
