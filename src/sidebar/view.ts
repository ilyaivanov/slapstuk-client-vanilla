import { cls, dom, ClassName, DivDefinition, EventsDefinition } from "../infra";
import * as controller from "./controller";
import * as style from "./styles";
import * as galleryStyle from "../gallery1/style";
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
        items.isVideo(item) ||
        (items.isFolder(item) && !items.hasChildren(item))
          ? cls.hidden
          : cls.none,
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

    arrow(
      [
        cls.sidebarRowCircle,
        item.type == "YTchannel" ? cls.sidebarRowCircleChannel : cls.none,
        item.type == "YTplaylist" ? cls.sidebarRowCirclePlaylist : cls.none,
      ],
      {
        click: (e) => {
          e.stopPropagation();
          controller.onCirclePressed(item);
        },
      }
    ),
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
    {
      className: cls.sidebarEditItemButton,
      children: "e",
      on: {
        click: (e) => {
          e.stopPropagation();
          controller.onEdit("HOME");
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
      children: minusSquare(cls.sidebarHeaderIcon),
    },
    {
      attributes: { title: "Hide all videos from sidebar" },
      children: hideVideo(cls.sidebarHeaderIcon),
    },
    {
      attributes: { title: "Create new folder" },
      children: folderPlus(cls.sidebarHeaderIcon),
      on: {
        click: controller.addNewItem,
      },
    },
  ],
});

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

export const folderPlus = (className?: ClassName | ClassName[]) =>
  svgPath(
    "M464,128H272L208,64H48A48,48,0,0,0,0,112V400a48,48,0,0,0,48,48H464a48,48,0,0,0,48-48V176A48,48,0,0,0,464,128ZM359.5,296a16,16,0,0,1-16,16h-64v64a16,16,0,0,1-16,16h-16a16,16,0,0,1-16-16V312h-64a16,16,0,0,1-16-16V280a16,16,0,0,1,16-16h64V200a16,16,0,0,1,16-16h16a16,16,0,0,1,16,16v64h64a16,16,0,0,1,16,16Z",
    "0 0 512 512",
    className
  );
export const minusSquare = (className?: ClassName | ClassName[]) =>
  svgPath(
    "M108 284c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h232c6.6 0 12 5.4 12 12v32c0 6.6-5.4 12-12 12H108zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z",
    "0 0 448 512",
    className
  );
export const hideVideo = (className?: ClassName | ClassName[]) =>
  svgPath(
    "M633.8 458.1l-55-42.5c15.4-1.4 29.2-13.7 29.2-31.1v-257c0-25.5-29.1-40.4-50.4-25.8L448 177.3v137.2l-32-24.7v-178c0-26.4-21.4-47.8-47.8-47.8H123.9L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4L42.7 82 416 370.6l178.5 138c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.5-6.9 4.2-17-2.8-22.4zM32 400.2c0 26.4 21.4 47.8 47.8 47.8h288.4c11.2 0 21.4-4 29.6-10.5L32 154.7v245.5z",
    "0 0 640 512",
    className
  );
export const showVideo = (className?: ClassName | ClassName[]) =>
  svgPath(
    "M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8zm189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8z",
    "0 0 576 512",
    className
  );
// export const list = (className?: ClassName | ClassName[]) =>
//   svgPath(
//     "M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm-6 400H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v340a6 6 0 0 1-6 6zm-42-92v24c0 6.627-5.373 12-12 12H204c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h200c6.627 0 12 5.373 12 12zm0-96v24c0 6.627-5.373 12-12 12H204c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h200c6.627 0 12 5.373 12 12zm0-96v24c0 6.627-5.373 12-12 12H204c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h200c6.627 0 12 5.373 12 12zm-252 12c0 19.882-16.118 36-36 36s-36-16.118-36-36 16.118-36 36-36 36 16.118 36 36zm0 96c0 19.882-16.118 36-36 36s-36-16.118-36-36 16.118-36 36-36 36 16.118 36 36zm0 96c0 19.882-16.118 36-36 36s-36-16.118-36-36 16.118-36 36-36 36 16.118 36 36z",
//     "0 0 512 512",
//     className
//   );
// export const userAvatar = (
//   className?: ClassName | ClassName[],
//   on?: EventsDefinition
// ) =>
//   svgPath(
//     "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z",
//     "0 0 448 512",
//     className,
//     on
//   );

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
