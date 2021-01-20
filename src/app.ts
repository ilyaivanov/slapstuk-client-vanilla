import { cls, css, cssClass, dom, ClassName, styles, cssText } from "./infra";
import { DivDefinition } from "./infra/dom";
import { startItems } from "./items";

//STYLES (goes into view)
cssClass(cls.page, {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gridTemplateRows: "auto 1fr",
  gridTemplateAreas: `
  "header header"
  "sidebar gallery"`,
  height: "100vh",
  backgroundColor: "#181818",
});
const headerHeight = 56;
cssClass(cls.header, {
  height: `${headerHeight}px`,
  backgroundColor: "#232325",
  gridArea: "header",
});

cssClass(cls.sidebar, {
  position: "relative",
  gridArea: "sidebar",
  backgroundColor: "#232325",
  overflowY: "overlay",
  width: "300px",
});

cssClass(cls.sidebarFocusContainer, {
  transition: "margin 200ms ease-out",
  position: "relative",
});

cssText(`
.${cls.sidebar}::-webkit-scrollbar {
  width: 0;
}

.${cls.sidebar}::-webkit-scrollbar-thumb {
  background-color: rgba(63, 63, 97, 0.8);
}

.${cls.sidebar}:hover::-webkit-scrollbar {
  width: 8px;
}`);

cssClass(cls.sidebarRow, {
  marginLeft: "2px",
  color: "white",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  cursor: "pointer",
  transition: "opacity 200ms ease-out",
});
css(`.${cls.sidebarRow}:hover`, {
  backgroundColor: "#333336",
});

const expandCollapseTransitionTime = 200;
cssClass(cls.sidebarRowExpandButton, {
  width: "14px",
  height: "14px",
  color: "rgb(184, 184, 184)",
  transition: `transform ${expandCollapseTransitionTime}ms ease-out, 
               opacity ${expandCollapseTransitionTime}ms ease-out`,
  opacity: "0",
});

cssClass(cls.sidebarRowExpandButtonContainer, {
  padding: "2px",
  color: "gray",
  ...styles.flexCenter,
});
css(`.${cls.sidebarFocusContainerFocused} .${cls.sidebarRow}`, {
  opacity: "0",
  pointerEvents: "none",
});
css(
  [
    `.${cls.sidebarRowFocused}.${cls.sidebarRow}`,
    `.${cls.sidebarRowChildrenContainerFocused} .${cls.sidebarRow}`,
  ],
  {
    opacity: "1",
    pointerEvents: "auto",
  }
);

css(
  `.${cls.sidebarRowExpandButtonContainer}:hover > .${cls.sidebarRowExpandButton}`,
  {
    color: "white",
  }
);

css(`.${cls.sidebar}:hover .${cls.sidebarRowExpandButton}`, {
  opacity: "1",
});

cssClass(cls.rotated, {
  transform: "rotateZ(90deg)",
});

cssClass(cls.hidden, {
  visibility: "hidden",
  pointerEvents: "none",
});

cssClass(cls.sidebarRowText, {
  padding: "4px",
  whiteSpace: "nowrap",
});

cssClass(cls.sidebarRowChildrenContainer, {
  transition: `height ${expandCollapseTransitionTime}ms ease-out`,
  overflow: "hidden",
});

cssClass(cls.sidebarRowCircle, {
  minWidth: "6px",
  width: "6px",
  height: "6px",
  borderRadius: "3px",
  backgroundColor: "rgb(184, 184, 184)",
  margin: "0 2px",
  transition: "transform 200ms ease-out, background-color 200ms ease-out",
});

css(`.${cls.sidebarRowCircle}:hover`, {
  transform: "scale(1.6)",
  backgroundColor: "white",
});

cssClass(cls.unfocusButton, {
  ...styles.absoluteTopRight(5, 5),
  zIndex: "200",
});

console.log(process.env.ENV_VARIABLE)
// MODEL
const items: Items =  startItems;

//Event handler (controller)
export const init = () => {
  const root = dom.findById("root");
  const itemsToRender = items.HOME.children.map((id) => viewRow(items[id], 0));
  root.appendChild(
    dom.div({
      className: cls.page,
      children: [
        { className: cls.header },
        {
          className: cls.sidebar,
          children: [
            viewUnfocusButton(),
            {
              className: cls.sidebarFocusContainer,
              children: itemsToRender.flat(),
            },
          ],
        },
      ],
    })
  );
};

const toggleSidebarVisibilityForItem = (item: Item) => {
  const level = parseLevelFromRow(dom.findById("row-" + item.id));

  item.isOpenFromSidebar = !item.isOpenFromSidebar;

  const button = findToggleButton(item.id);

  if (item.isOpenFromSidebar) {
    button.classList.add(cls.rotated);
    showItemChildren(item, level);
  } else {
    button.classList.remove(cls.rotated);
    removeItemChildren(item.id);
  }
};

const showItemChildren = (item: Item, level: number) => {
  const childrenElement = findItemChildrenContainer(item.id);
  const children = item.children
    .map((id) => viewRow(items[id], level + 1))
    .flat()
    .map(dom.div);

  childrenElement.style.height = "0px";
  childrenElement.appendChild(dom.fragment(children));
  requestAnimationFrame(() => {
    childrenElement.style.height = childrenElement.scrollHeight + "px";
  });
  setTimeout(() => {
    childrenElement.style.removeProperty("height");
  }, expandCollapseTransitionTime);
};

const removeItemChildren = (itemId: string) => {
  const childrenElement = findItemChildrenContainer(itemId);
  childrenElement.style.height = childrenElement.scrollHeight + "px";
  requestAnimationFrame(() => {
    childrenElement.style.height = "0px";
    setTimeout(() => {
      childrenElement.innerHTML = "";
    }, expandCollapseTransitionTime);
  });
};

const focusOnItem = (item: Item) => {
  const alreadyFocusedRow = dom.maybeFindFirstByClass(cls.sidebarRowFocused);
  if (alreadyFocusedRow)
    alreadyFocusedRow.classList.remove(cls.sidebarRowFocused);

  const alreaduFocusedContainer = dom.maybeFindFirstByClass(
    cls.sidebarRowChildrenContainerFocused
  );
  if (alreaduFocusedContainer)
    alreaduFocusedContainer.classList.remove(
      cls.sidebarRowChildrenContainerFocused
    );

  const row = dom.findById("row-" + item.id);

  //I'm not changing model here, thus I would be able to close item back again when unfocus
  if (!item.isOpenFromSidebar) showItemChildren(item, parseLevelFromRow(row));

  dom
    .findFirstByClass(cls.sidebarFocusContainer)
    .classList.add(cls.sidebarFocusContainerFocused);
  row.classList.add(cls.sidebarRowFocused);
  findItemChildrenContainer(item.id).classList.add(
    cls.sidebarRowChildrenContainerFocused
  );
  setFocusContainerNegativeMargins(
    parseInt(row.style.paddingLeft),
    row.offsetTop
  );
};

const unfocus = () => {
  dom
    .findFirstByClass(cls.sidebarFocusContainerFocused)
    .classList.remove(cls.sidebarFocusContainerFocused);
  const row = dom.findFirstByClass(cls.sidebarRowFocused);
  row.classList.remove(cls.sidebarRowFocused);
  const itemId = row.id.substr(4);
  console.log(
    !items[itemId].isOpenFromSidebar,
    findItemChildrenContainer(itemId).childNodes.length
  );
  if (
    !items[itemId].isOpenFromSidebar &&
    findItemChildrenContainer(itemId).childNodes.length !== 0
  ) {
    removeItemChildren(itemId);
  }
  setFocusContainerNegativeMargins(0, 0);
};

const setFocusContainerNegativeMargins = (left: number, top: number) => {
  const s = dom.findFirstByClass(cls.sidebarFocusContainer);
  s.style.marginLeft = -left + "px";
  s.style.marginTop = -top + "px";
};

//VIEW
const viewRow = (item: Item, level: number): DivDefinition[] => {
  return [
    {
      id: "row-" + item.id,
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
            click: () => toggleSidebarVisibilityForItem(item),
          },
        },
        {
          className: cls.sidebarRowCircle,
          on: {
            click: () => focusOnItem(item),
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

const viewChildren = (itemId: string, level: number): DivDefinition => {
  const children = items[itemId].children.map((id) => items[id]);
  return {
    className: cls.sidebarRowChildrenContainer,
    children: items[itemId].isOpenFromSidebar
      ? children.map((row) => viewRow(row, level)).flat()
      : [],
  };
};
const viewUnfocusButton = (): DivDefinition => ({
  className: cls.unfocusButton,
  type: "button",
  children: "unfocus",
  on: {
    click: unfocus,
  },
});

export const findToggleButton = (itemId: string) => {
  const row = dom.findById("row-" + itemId);
  return dom.findFirstByClass(cls.sidebarRowExpandButton, row);
};
export const findItemChildrenContainer = (itemId: string): HTMLElement => {
  return dom.findById("row-" + itemId).nextSibling as HTMLElement;
};

//Application specific utils
const parseLevelFromRow = (row: HTMLElement): number => {
  const levelStr = row.getAttribute("data-level");
  if (!levelStr) {
    console.error(row);
    throw Error(`No data-level attribute found on item.`);
  }
  return parseInt(levelStr);
};

//UTILS

const chevron = (className?: ClassName | ClassName[]): DivDefinition =>
  svgPath(
    "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z",
    "0 0 256 512",
    className
  );

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
